import { NextRequest, NextResponse } from 'next/server';
import { scrapeProduct, ProductNotFoundError, ScrapingError } from '@/lib/scraper';
import { FileLogger } from '@/lib/logger/file-logger';

const logger = new FileLogger();

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const body = await request.json();
  
  try {
    const { url } = body;

    if (!url) {
      await logger.log({
        url: 'invalid',
        success: false,
        error: 'URL is required',
        ip,
      });
      
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    if (!url.includes('mercadolibre.com.ar')) {
      await logger.log({
        url,
        success: false,
        error: 'Invalid Mercado Libre URL',
        ip,
      });
      
      return NextResponse.json(
        { error: 'Invalid Mercado Libre URL' },
        { status: 400 }
      );
    }

    const product = await scrapeProduct(url);
    
    
    // Only log successful scrapes if the last successful log is more than an hour ago
    // or if there's no previous successful log
    const lastSuccessfullLog = await logger.getLastSuccessfulLog();
    if (lastSuccessfullLog) {
      const lastLogTime = new Date(lastSuccessfullLog.timestamp);
      const currentTime = new Date();
      const hourInMs = 60 * 60 * 1000;
      
      // If less than an hour has passed since the last successful log, return early
      if (currentTime.getTime() - lastLogTime.getTime() < hourInMs) {
        console.log("ℹ️ ~ Skipping log because last successful log was less than an hour ago");
        return NextResponse.json(product);
      }
    }

    await logger.log({
      url,
      success: true,
      data: product,
      ip,
    });
    
    // Create a properly structured report
    const report = {
      timestamp: new Date().toISOString(),
      product: {
        title: product.title || 'Unknown Product',
        url: product.url,
        price: product.price,
        currency: product.currency || 'ARS',
        available: product.available || false,
        delivery: product.delivery || { home: null, pickup: null }
      }
    };

    return NextResponse.json({ 
      success: true, 
      data: product,
      report // Send the structured report
    });
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      await logger.log({
        url: body?.url || 'unknown',
        success: false,
        error: error.message,
        ip,
      });
      
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }

    const scrapingError = error as ScrapingError;
    await logger.log({
      url: body?.url || 'unknown',
      success: false,
      error: scrapingError.message,
      ip,
    });
    
    return NextResponse.json(
      { error: scrapingError.message },
      { status: 500 }
    );
  }
} 
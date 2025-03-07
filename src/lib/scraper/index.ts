import axios from 'axios';
import * as cheerio from 'cheerio';

export interface DeliveryInfo {
  type: string;
  isFreeDelivery: boolean;
  date: string | null;
  timeRemaining?: string;
}

export interface ScrapedProduct {
  title: string,
  url: string,
  price: number,
  currency: string,
  available: boolean,
  delivery: {
      home: {
          type: string,
          isFreeDelivery: boolean,
          date: string | null
      },
      pickup: {
          type: string,
          isFreeDelivery: boolean,
          date: string | null
      }
  }
}

export interface ScrapingError {
  message: string;
  code: string;
  url: string;
}

export class ProductNotFoundError extends Error {
  constructor(url: string) {
    super(`Product not found at URL: ${url}`);
    this.name = 'ProductNotFoundError';
  }
}

export async function scrapeProduct(url: string): Promise<ScrapedProduct> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    
    // Extract price from meta tag
    const priceMeta = $('meta[itemprop="price"]');
    if (!priceMeta.length) {
      throw new ProductNotFoundError(url);
    }

    const priceStr = priceMeta.attr('content');
    if (!priceStr) {
      throw new Error('Price content not found');
    }

    // Extract currency from meta tag
    const currencyMeta = $('meta[itemprop="priceCurrency"]');
    const currency = currencyMeta.attr('content') || 'ARS';

    // Extract title (optional)
    const titleMeta = $('meta[property="og:title"]');
    const title = titleMeta.attr('content');

    // Check availability
    const available = !$('.ui-pdp-stock-message').length;

    const price = parseInt(priceStr, 10);
    if (Number.isNaN(price)) {
      throw new Error('Invalid price format');
    }

    // Extract delivery information
    const homeDelivery: DeliveryInfo = {
      type: 'delivery',
      isFreeDelivery: false,
      date: null
    };

    const pickupDelivery: DeliveryInfo = {
      type: 'pickup',
      isFreeDelivery: false,
      date: null
    };

    // Home delivery info
    const shippingDiv = $('.ui-pdp-container__row--shipping-summary');
    if (shippingDiv.length) {
      const deliveryText = shippingDiv.find('.ui-pdp-media__title').text().trim();
      homeDelivery.isFreeDelivery = deliveryText.toLowerCase().includes('gratis');
      
      // Extract date using regex
      const dateMatch = deliveryText.match(/el ([^,]+)/);
      if (dateMatch) {
        homeDelivery.date = dateMatch[1].trim();
      }

      // Extract time remaining if available
      const timeRemainingText = shippingDiv.find('#MORE_THAN_TWO_HOURS_WITH_MIN').text();
      if (timeRemainingText) {
        homeDelivery.timeRemaining = timeRemainingText.trim();
      }
    }

    // Pickup info
    const pickupDiv = $('.ui-pdp-container__row--pick-up-summary');
    if (pickupDiv.length) {
      const pickupText = pickupDiv.find('.ui-pdp-media__title').text().trim();
      pickupDelivery.isFreeDelivery = pickupText.toLowerCase().includes('gratis');
      
      // Extract date range using regex
      const dateMatch = pickupText.match(/entre el (.+?) en correo/);
      if (dateMatch) {
        pickupDelivery.date = dateMatch[1].trim();
      }
    }

    return {
      url,
      price,
      currency,
      title: title || '',
      available,
      delivery: {
        home: homeDelivery,
        pickup: pickupDelivery
      }
    };
  } catch (error) {
    if (error instanceof ProductNotFoundError) {
      throw error;
    }

    if (axios.isAxiosError(error)) {
      throw {
        message: error.message,
        code: error.code || 'NETWORK_ERROR',
        url
      } as ScrapingError;
    }

    throw {
      message: 'Unknown error occurred while scraping',
      code: 'UNKNOWN_ERROR',
      url
    } as ScrapingError;
  }
} 
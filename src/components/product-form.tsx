'use client';

import { ScanSearchIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import type { ScrapedProduct } from "@/lib/scraper";
import { useLocalStorageReports } from "@/hooks/use-local-storage-reports";

interface ScanProductResponse {
  success: boolean,
  data: {
      url: string,
      price: number,
      currency: string,
      title: string,
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
  },
  report: {
      timestamp: string,
      product: {
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
  }
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function ProductForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<ScrapedProduct | null>(null);
  const { addReport } = useLocalStorageReports();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setProduct(null);

    const formData = new FormData(e.currentTarget);
    const url = formData.get('url') as string;

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch product');
      }

      const data: ScanProductResponse = await response.json();
      
      addReport(data.report);
      setProduct(data.report.product);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-neutral-800 shadow-sm rounded-lg p-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label 
            htmlFor="url" 
            className="block text-sm font-medium text-neutral-200 mb-1"
          >
            Product URL
          </label>
          <input
            type="url"
            name="url"
            id="url"
            required
            disabled={isLoading}
            placeholder="https://articulo.mercadolibre.com.ar/..."
            className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 disabled:opacity-50"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-300 text-neutral-800 font-semibold py-2 px-4 rounded-md cursor-pointer hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 disabled:opacity-50"
        >
          <span className="flex items-center justify-center">
            {isLoading ? (
              <Loader2Icon className="size-6 mr-2 animate-spin" />
            ) : (
              <ScanSearchIcon className="size-6 mr-2" />
            )}
            {isLoading ? 'Checking...' : 'Check Price'}
          </span>
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-500">
          {error}
        </div>
      )}

      {product && (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-md text-green-100 space-y-4">
          {/* Title */}
          <h3 className="text-lg font-medium text-green-300">{product.title}</h3>
          
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-green-400">
              {formatPrice(product.price, product.currency)}
            </span>
            <span className="text-green-600 text-sm">
              {product.currency}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Status:</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              product.available 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}>
              {product.available ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Delivery Information */}
          <div className="space-y-3">
            {/* Home Delivery */}
            {product.delivery.home.type && (
              <div className="border-t border-green-500/20 pt-3">
                <h4 className="text-sm font-medium mb-2">Home Delivery</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <span className={product.delivery.home.isFreeDelivery ? 'text-green-400' : ''}>
                      {product.delivery.home.isFreeDelivery ? '✓ Free Delivery' : 'Paid Delivery'}
                    </span>
                  </p>
                  {product.delivery.home.date && (
                    <p>Arrives: {product.delivery.home.date.toUpperCase()}</p>
                  )}
                </div>
              </div>
            )}

            {/* Pickup */}
            {/* {product.delivery.pickup.type && (
              <div className="border-t border-green-500/20 pt-3">
                <h4 className="text-sm font-medium mb-2">Pickup</h4>
                <div className="space-y-1 text-sm">
                  <p className="flex items-center gap-2">
                    <span className={product.delivery.pickup.isFreeDelivery ? 'text-green-400' : ''}>
                      {product.delivery.pickup.isFreeDelivery ? '✓ Free Pickup' : 'Paid Pickup'}
                    </span>
                  </p>
                  {product.delivery.pickup.date && (
                    <p>Available: {product.delivery.pickup.date}</p>
                  )}
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
} 
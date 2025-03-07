import { LogEntry } from "@/lib/logger/types";
import { ScrapedProduct } from "@/lib/scraper";
import { formatPrice } from "@/lib/utils";

interface ReportsTableProps {
  logs: LogEntry[];
}

export function ReportsTable({ logs }: ReportsTableProps) {
  return (
    <>
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden md:block bg-neutral-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Delivery
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {logs.map((log) => (
                <tr key={`${log.url}-${log.timestamp}`} className="hover:bg-neutral-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <time dateTime={log.timestamp}>
                      {new Date(log.timestamp).toLocaleString()}
                    </time>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>
                      <p className="font-medium text-neutral-200">
                        {log.data?.title || 'Unknown Product'}
                      </p>
                      <a 
                        href={log.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-yellow-500 hover:text-yellow-400"
                      >
                        View Product →
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {log.data && (
                      <span className="font-medium text-neutral-200">
                        {formatPrice(log.data.price, log.data.currency)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StockBadge available={log.data?.available} />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <DeliveryInfo delivery={log.data?.delivery} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (hidden on desktop) */}
      <div className="md:hidden space-y-4">
        {logs.map((log) => (
          <div 
            key={`${log.url}-${log.timestamp}`}
            className="bg-neutral-800 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium text-neutral-200">
                  {log.data?.title || 'Unknown Product'}
                </h3>
                <p className="text-lg font-semibold text-yellow-500">
                  {log.data && formatPrice(log.data.price, log.data.currency)}
                </p>
              </div>
              {/* <StockBadge available={log.data?.available} /> */}
            </div>

            <div className="text-xs text-neutral-400">
              <time dateTime={log.timestamp}>
                {new Date(log.timestamp).toLocaleString()}
              </time>
            </div>

            <DeliveryInfo delivery={log.data?.delivery} />

            <a 
              href={log.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center text-sm text-yellow-500 hover:text-yellow-400 border border-yellow-500/20 rounded-md py-2 mt-3"
            >
              View Product →
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

// Extracted components for reuse
function StockBadge({ available }: { available?: boolean }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs ${
      available 
        ? 'bg-green-500/20 text-green-300' 
        : 'bg-red-500/20 text-red-300'
    }`}>
      {available ? 'In Stock' : 'Out of Stock'}
    </span>
  );
}

function DeliveryInfo({ delivery }: { delivery?: ScrapedProduct['delivery'] }) {
  if (!delivery) return null;

  return (
    <div className="space-y-1">
      {delivery.home.type && (
        <p className="text-xs">
          <span className={delivery.home.isFreeDelivery ? 'text-green-400' : ''}>
            {delivery.home.isFreeDelivery ? '✓ Free Delivery' : 'Paid Delivery'}
          </span>
          {delivery.home.date && (
            <span className="text-neutral-400 ml-1">
              ({delivery.home.date})
            </span>
          )}
        </p>
      )}
      {delivery.pickup.type && (
        <p className="text-xs">
          <span className={delivery.pickup.isFreeDelivery ? 'text-green-400' : ''}>
            {delivery.pickup.isFreeDelivery ? '✓ Free Pickup' : 'Paid Pickup'}
          </span>
          {delivery.pickup.date && (
            <span className="text-neutral-400 ml-1">
              ({delivery.pickup.date})
            </span>
          )}
        </p>
      )}
    </div>
  );
} 
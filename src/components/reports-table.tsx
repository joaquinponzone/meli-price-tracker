
import { Trash2Icon } from "lucide-react";
import { Report } from "@/hooks/use-local-storage-reports";

interface ReportsTableProps {
  reports: Report[];
  onDelete?: (timestamp: string) => void;
}

export function ReportsTable({ reports, onDelete }: ReportsTableProps) {
  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-neutral-800">
            <th className="p-4 text-left rounded-tl-md">Reported at</th>
            <th className="p-4 text-left">Product</th>
            <th className="p-4 text-left">Price</th>
            <th className="p-4 text-left rounded-tr-md">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => {
            // Safely access data with optional chaining    
            return (
              <tr key={report.timestamp} className="border-b">
                <td className="p-4 text-sm rounded-tl-md">
                  {new Date(report.timestamp).toLocaleDateString("es-AR", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </td>
                <td className="text-yellow-500 p-4 w-3/6 max-w-[200px] truncate">
                  {report?.product?.title ? (
                    <a  
                      href={report?.product?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {report?.product?.title || 'Unknown Product'}
                    </a>
                  ) : (
                    <span className="text-sm">{report?.product?.title || 'Unknown Product'}</span>
                  )}
                </td>
                <td className="p-4 text-sm font-mono">
                  {report?.product?.price && report?.product?.currency && (
                    new Intl.NumberFormat('es-AR', {
                      style: 'currency',
                      currency: report?.product?.currency
                    }).format(report?.product?.price)
                  )}
                </td>
                <td className="p-4 rounded-tr-md">
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(report.timestamp)}
                      className="p-2 text-red-500 hover:text-red-700 rounded-full hover:bg-red-100/20 transition-colors"
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
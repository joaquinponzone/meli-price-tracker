
import { FileLogger } from "@/lib/logger/file-logger";
import { ReportsTable } from "@/components/reports-table";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function LogsPage() {
  const logger = new FileLogger();
  const logs = await logger.getLogs();
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <span className="flex flex-col gap-2 justify-center">
            <Link href="/" className="flex gap-2 items-center text-neutral-400 hover:text-neutral-200">
              <ArrowLeftIcon className="size-5" />
              Back to scanner
            </Link>
            <h1 className="text-3xl font-bold">Scannings Reports</h1>
          </span>
          <p className="text-sm text-neutral-400">
            Total watchs: {logs.length}
          </p>
        </div>
        
        <ReportsTable logs={logs} />
      </div>
    </main>
  );
}
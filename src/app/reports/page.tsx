'use client';


import { ReportsTable } from "@/components/reports-table";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { useLocalStorageReports } from "@/hooks/use-local-storage-reports";

export default function LogsPage() {
  const { reports, deleteReport } = useLocalStorageReports();
  
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
            Total watchs: {reports.length}
          </p>
        </div>
        <ReportsTable reports={reports} onDelete={deleteReport} />
      </div>
    </main>
  );
}
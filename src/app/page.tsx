import Link from "next/link";
import { ProductForm } from "@/components/product-form";
import { ClipboardListIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Meli Sentinel</h1>
          <Link 
            href="/reports"
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200"
          >
            <ClipboardListIcon className="w-4 h-4" />
            View Reports
          </Link>
        </div>
        <ProductForm />
      </div>
    </main>
  );
}
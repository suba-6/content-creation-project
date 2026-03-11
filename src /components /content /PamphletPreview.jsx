import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, FileText, Printer } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function PamphletPreview({ content }) {
  const printRef = useRef(null);

  const copyContent = () => {
    navigator.clipboard.writeText(content.text_content || "");
    toast.success("Pamphlet content copied to clipboard");
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${content.title || "Pamphlet"}</title>
          <style>
            body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #1e293b; line-height: 1.7; }
            h1 { font-size: 28px; margin-bottom: 8px; color: #0f172a; }
            h2 { font-size: 20px; margin-top: 24px; color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 4px; }
            h3 { font-size: 16px; margin-top: 16px; color: #334155; }
            ul, ol { padding-left: 24px; }
            li { margin-bottom: 4px; }
            p { margin: 8px 0; }
            strong { color: #0f172a; }
            blockquote { border-left: 3px solid #6366f1; padding-left: 16px; margin: 16px 0; color: #475569; font-style: italic; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Hero image */}
      {content.output_url && (
        <div className="relative rounded-2xl overflow-hidden h-52 bg-slate-100">
          <img
            src={content.output_url}
            alt="Pamphlet visual"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 via-emerald-900/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Pamphlet / Flyer</span>
            </div>
            <p className="text-white font-bold text-base leading-snug">{content.title}</p>
          </div>
        </div>
      )}

      {/* Pamphlet header */}
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">
              {content.title || "Pamphlet / Flyer"}
            </p>
            <p className="text-xs text-emerald-100">{content.topic}</p>
          </div>
        </div>
      </div>

      {/* Pamphlet content */}
      <div
        ref={printRef}
        className="bg-white rounded-2xl border border-emerald-100 p-6 max-h-[400px] overflow-y-auto"
      >
        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{content.text_content || ""}</ReactMarkdown>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handlePrint}
          size="sm"
          className="rounded-lg flex-1 bg-emerald-600 hover:bg-emerald-700"
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print / Save as PDF
        </Button>
        <Button
          onClick={copyContent}
          variant="outline"
          size="sm"
          className="rounded-lg flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        >
          <Copy className="w-4 h-4 mr-1.5" />
          Copy Text
        </Button>
      </div>
    </motion.div>
  );
}

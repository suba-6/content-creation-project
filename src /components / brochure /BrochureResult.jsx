import React, { useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Printer, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const TEMPLATE_LABELS = { single: "Single Page", bifold: "Bi-fold", trifold: "Tri-fold" };

export default function BrochureResult({ content }) {
  const printRef = useRef(null);
  const meta = content.metadata || {};

  const handlePrint = () => {
    const printContent = printRef.current?.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <html><head><title>${content.title || "Brochure"}</title>
      <style>
        body { font-family: Georgia, serif; margin: 40px; line-height: 1.7; color: #1a1a2e; }
        h1, h2, h3 { color: #1e3a5f; margin-top: 24px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 6px; }
        img { max-width: 100%; border-radius: 8px; margin-bottom: 16px; display: block; }
        p { margin-bottom: 12px; }
        @media print { body { margin: 20px; } }
      </style></head>
      <body>${printContent}</body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {content.output_url && (
        <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
          <img src={content.output_url} alt="Brochure visual" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs mb-1 block w-fit">
              {TEMPLATE_LABELS[meta.template] || "Brochure"}
            </Badge>
            <p className="text-white font-bold text-sm">{content.title}</p>
          </div>
          <a href={content.output_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs cursor-pointer hover:bg-white/30">View Full Size</Badge>
          </a>
        </div>
      )}

      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{content.title || "Brochure"}</p>
            <p className="text-xs text-blue-100">{content.topic} • {TEMPLATE_LABELS[meta.template]}</p>
          </div>
        </div>
      </div>

      <div ref={printRef} className="bg-white rounded-2xl border border-blue-100 p-6 max-h-[420px] overflow-y-auto">
        {content.output_url && (
          <img src={content.output_url} alt="" className="w-full h-36 object-cover rounded-xl mb-4" />
        )}
        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{content.text_content || ""}</ReactMarkdown>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handlePrint} size="sm" className="rounded-xl flex-1 bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-1.5" /> Print / PDF
        </Button>
        <Button
          onClick={() => { navigator.clipboard.writeText(content.text_content || ""); toast.success("Content copied!"); }}
          variant="outline" size="sm"
          className="rounded-xl flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
        >
          <Copy className="w-4 h-4 mr-1.5" /> Copy Text
        </Button>
      </div>
    </motion.div>
  );
}

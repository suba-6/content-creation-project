import React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Film, Clock, Users, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function VideoScriptPreview({ content }) {
  const metadata = content.metadata || {};

  const copyScript = () => {
    navigator.clipboard.writeText(content.text_content || "");
    toast.success("Script copied to clipboard");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Cinematic thumbnail */}
      {content.output_url && (
        <div className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-900">
          <img
            src={content.output_url}
            alt={content.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-violet-500 flex items-center justify-center">
                <Film className="w-3 h-3 text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Video Script</span>
            </div>
            <p className="text-white font-bold text-base leading-snug">{content.title}</p>
          </div>
        </div>
      )}

      {/* Script header */}
      <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Film className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">
              {content.title || "Video Script"}
            </p>
            <p className="text-xs text-violet-200">{content.topic}</p>
          </div>
        </div>

        {metadata.duration && (
          <div className="flex flex-wrap gap-3 text-xs text-violet-100">
            <span className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
              <Clock className="w-3 h-3" />
              {metadata.duration}
            </span>
            {metadata.target_audience && (
              <span className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                <Users className="w-3 h-3" />
                {metadata.target_audience}
              </span>
            )}
            {metadata.tone && (
              <span className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1">
                <Volume2 className="w-3 h-3" />
                {metadata.tone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Script content */}
      <div className="bg-white rounded-2xl border border-violet-100 p-5 max-h-[400px] overflow-y-auto">
        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{content.text_content || ""}</ReactMarkdown>
        </div>
      </div>

      <Button
        onClick={copyScript}
        size="sm"
        className="rounded-lg w-full bg-violet-600 hover:bg-violet-700 text-white"
      >
        <Copy className="w-4 h-4 mr-1.5" />
        Copy Script
      </Button>
    </motion.div>
  );
}

import React from "react";
import { motion } from "framer-motion";
import { Film, Clock, Users, Volume2, Copy, Star, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const TEMPLATE_MAP = {
  promotional: { icon: Target, color: "from-orange-500 to-amber-500", label: "Promotional" },
  educational: { icon: BookOpen, color: "from-blue-500 to-cyan-500", label: "Educational" },
  entertaining: { icon: Star, color: "from-pink-500 to-rose-500", label: "Entertaining" },
};

export default function VideoStudioResult({ content }) {
  const meta = content.metadata || {};
  const t = TEMPLATE_MAP[meta.template] || TEMPLATE_MAP.promotional;
  const Icon = t.icon;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {content.output_url && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
          <img src={content.output_url} alt={content.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {meta.brand_name && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">{meta.brand_name}</Badge>
            </div>
          )}
          <a href={content.output_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs cursor-pointer hover:bg-white/30">View Full Size</Badge>
          </a>
        </div>
      )}

      <div className={`bg-gradient-to-br ${t.color} rounded-2xl p-5`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{content.title}</p>
            <p className="text-xs text-white/70">{content.topic}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {meta.duration && <Badge className="bg-white/15 text-white border-0 text-xs"><Clock className="w-3 h-3 mr-1" />{meta.duration}</Badge>}
          {meta.target_audience && <Badge className="bg-white/15 text-white border-0 text-xs"><Users className="w-3 h-3 mr-1" />{meta.target_audience}</Badge>}
          {meta.tone && <Badge className="bg-white/15 text-white border-0 text-xs"><Volume2 className="w-3 h-3 mr-1" />{meta.tone}</Badge>}
          <Badge className="bg-white/15 text-white border-0 text-xs capitalize">{t.label}</Badge>
        </div>
        {(meta.brand_name || meta.tagline) && (
          <p className="text-white/80 text-xs mt-2 font-medium">
            {meta.brand_name}{meta.tagline ? ` — "${meta.tagline}"` : ""}
          </p>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-5 max-h-[400px] overflow-y-auto">
        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{content.text_content || ""}</ReactMarkdown>
        </div>
      </div>

      <Button
        onClick={() => { navigator.clipboard.writeText(content.text_content || ""); toast.success("Script copied!"); }}
        size="sm"
        className={`w-full rounded-xl bg-gradient-to-r ${t.color} text-white border-0`}
      >
        <Copy className="w-4 h-4 mr-1.5" /> Copy Full Script
      </Button>
    </motion.div>
  );
}

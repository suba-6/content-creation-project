import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Music, Hash, Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const PLATFORM_COLORS = {
  tiktok: "from-gray-800 to-gray-900",
  "instagram reels": "from-purple-600 to-pink-500",
  "youtube shorts": "from-red-600 to-orange-500",
};

export default function SocialResult({ content }) {
  const meta = content.metadata || {};
  const colorKey = (meta.platform || "").toLowerCase();
  const color = PLATFORM_COLORS[colorKey] || "from-pink-500 to-rose-500";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {content.output_url && (
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900">
          <img src={content.output_url} alt={content.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs">{meta.platform}</Badge>
          </div>
          <a href={content.output_url} target="_blank" rel="noopener noreferrer" className="absolute top-3 right-3">
            <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 text-xs cursor-pointer hover:bg-white/30">View Full Size</Badge>
          </a>
        </div>
      )}

      <div className={`bg-gradient-to-br ${color} rounded-2xl p-5`}>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">{content.title || "Social Content"}</p>
            <p className="text-xs text-white/70">{content.topic}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {meta.platform && <Badge className="bg-white/15 text-white border-0 text-xs">{meta.platform}</Badge>}
          {meta.genre && <Badge className="bg-white/15 text-white border-0 text-xs capitalize">{meta.genre.replace("_", " ")}</Badge>}
        </div>
      </div>

      {meta.hook && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100 p-4">
          <p className="text-xs font-bold text-pink-600 uppercase tracking-wide mb-1">🎣 Opening Hook</p>
          <p className="text-sm text-slate-800 font-medium">{meta.hook}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-pink-100 p-5 max-h-[400px] overflow-y-auto">
        <div className="prose prose-sm prose-slate max-w-none">
          <ReactMarkdown>{content.text_content || ""}</ReactMarkdown>
        </div>
      </div>

      {meta.music_suggestions && (
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Music className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-slate-700">Music Suggestions</span>
          </div>
          <p className="text-sm text-slate-600">{meta.music_suggestions}</p>
        </div>
      )}

      {meta.hashtags && meta.hashtags.length > 0 && (
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-slate-700">Hashtags</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.hashtags.slice(0, 20).map((tag, i) => (
              <Badge key={i} className="bg-pink-50 text-pink-700 border-pink-100 text-xs">
                {tag.startsWith("#") ? tag : `#${tag}`}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {meta.posting_times && (
        <div className="bg-white rounded-2xl border border-pink-100 p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-semibold text-slate-700">Best Posting Times</span>
          </div>
          <p className="text-sm text-slate-600">{meta.posting_times}</p>
        </div>
      )}

      <Button
        onClick={() => { navigator.clipboard.writeText(content.text_content || ""); toast.success("Content package copied!"); }}
        size="sm"
        className={`w-full rounded-xl bg-gradient-to-r ${color} text-white border-0`}
      >
        <Copy className="w-4 h-4 mr-1.5" /> Copy Content Package
      </Button>
    </motion.div>
  );
}

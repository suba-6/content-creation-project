import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image, Film, FileText, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const typeConfig = {
  banner: {
    icon: Image,
    label: "Banner",
    color: "bg-rose-50 text-rose-700 border-rose-200",
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
  },
  video_script: {
    icon: Film,
    label: "Video Script",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    iconColor: "text-violet-500",
    iconBg: "bg-violet-50",
  },
  pamphlet: {
    icon: FileText,
    label: "Pamphlet",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
  },
  social_content: {
    icon: TrendingUp,
    label: "Social",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50",
  },
};

const statusConfig = {
  generating: { label: "Generating...", color: "bg-amber-50 text-amber-700 border-amber-200" },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-200" },
  failed: { label: "Failed", color: "bg-red-50 text-red-700 border-red-200" },
};

export default function ContentCard({ content, onClick, index = 0 }) {
  const type = typeConfig[content.content_type] || typeConfig.banner;
  const status = statusConfig[content.status] || statusConfig.completed;
  const Icon = type.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        onClick={onClick}
        className="group cursor-pointer border border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all duration-300 overflow-hidden rounded-2xl"
      >
        {/* Thumbnail */}
        <div className="relative h-36 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {content.output_url ? (
            <img
              src={content.output_url}
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-14 h-14 rounded-2xl ${type.iconBg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${type.iconColor}`} />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className={`${type.color} border text-[10px] font-medium`}>
              {type.label}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className={`${status.color} border text-[10px] font-medium`}>
              {status.label}
            </Badge>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-sm text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
            {content.title || content.topic}
          </h3>
          <p className="text-xs text-slate-400 mt-1 truncate">{content.topic}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="w-3 h-3" />
              {content.created_date
                ? format(new Date(content.created_date), "MMM d, yyyy")
                : "Just now"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

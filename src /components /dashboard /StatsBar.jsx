import React from "react";
import { Image, Film, FileText, Layers } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsBar({ contents }) {
  const stats = [
    {
      label: "Total",
      value: contents.length,
      icon: Layers,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Banners",
      value: contents.filter((c) => c.content_type === "banner").length,
      icon: Image,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Scripts",
      value: contents.filter((c) => c.content_type === "video_script").length,
      icon: Film,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Pamphlets",
      value: contents.filter((c) => c.content_type === "pamphlet").length,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

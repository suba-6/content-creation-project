import React from "react";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, Image } from "lucide-react";
import { motion } from "framer-motion";

export default function BannerPreview({ content }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="relative group rounded-2xl overflow-hidden bg-slate-100 aspect-video">
        {content.output_url ? (
          <img
            src={content.output_url}
            alt={content.title || content.topic}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image className="w-12 h-12 text-slate-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <p className="text-white font-medium text-sm">{content.title}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {content.output_url && (
          <>
            <a href={content.output_url} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="outline" size="sm" className="rounded-lg w-full">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                View Full Size
              </Button>
            </a>
            <a href={content.output_url} download className="flex-1">
              <Button size="sm" className="rounded-lg w-full bg-indigo-600 hover:bg-indigo-700">
                <Download className="w-4 h-4 mr-1.5" />
                Download
              </Button>
            </a>
          </>
        )}
      </div>
    </motion.div>
  );
}

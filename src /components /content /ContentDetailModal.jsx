import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import BannerPreview from "./BannerPreview";
import VideoScriptPreview from "./VideoScriptPreview";
import PamphletPreview from "./PamphletPreview";
import VideoStudioResult from "../video/VideoStudioResult";
import BrochureResult from "../brochure/BrochureResult";
import SocialResult from "../social/SocialResult";

export default function ContentDetailModal({ content, open, onClose, onDelete }) {
  if (!content) return null;

  const renderPreview = () => {
    switch (content.content_type) {
      case "banner":
        return <BannerPreview content={content} />;
      case "video_script":
        return <VideoScriptPreview content={content} />;
      case "pamphlet":
        return content.metadata?.format === "brochure"
          ? <BrochureResult content={content} />
          : <PamphletPreview content={content} />;
      case "social_content":
        return <SocialResult content={content} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-bold text-slate-800">
            {content.title || content.topic}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">
          {renderPreview()}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
              onClick={() => onDelete(content.id)}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

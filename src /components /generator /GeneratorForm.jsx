import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Image, Film, FileText, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const contentTypes = [
  {
    value: "banner",
    label: "Marketing Banner",
    icon: Image,
    description: "AI-generated promotional image",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
  {
    value: "video_script",
    label: "Video Script",
    icon: Film,
    description: "Storyboard & script for promo video",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    value: "pamphlet",
    label: "Pamphlet / Flyer",
    icon: FileText,
    description: "Print-ready flyer content",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

export default function GeneratorForm({ onGenerate, isGenerating }) {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [contentType, setContentType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic.trim() || !contentType) return;
    onGenerate({ topic: topic.trim(), details: details.trim(), contentType });
  };

  const selectedType = contentTypes.find((t) => t.value === contentType);

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          What are you promoting?
        </Label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. Organic Coffee Brand, SaaS Product Launch, Yoga Studio..."
          className="h-12 text-base border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl"
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-slate-700">
          Additional details{" "}
          <span className="text-slate-400 font-normal">(optional)</span>
        </Label>
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Target audience, tone, key features, special offers..."
          className="min-h-[80px] border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 rounded-xl resize-none"
          disabled={isGenerating}
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium text-slate-700">
          Content type
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {contentTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = contentType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setContentType(type.value)}
                disabled={isGenerating}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                  ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50/50 shadow-sm shadow-indigo-100"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                  }
                  ${isGenerating ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div
                  className={`w-10 h-10 rounded-lg ${type.bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${type.color}`} />
                </div>
                <p className="font-semibold text-sm text-slate-800">
                  {type.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {type.description}
                </p>
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Button
        type="submit"
        disabled={!topic.trim() || !contentType || isGenerating}
        className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-base shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-40 disabled:shadow-none"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating {selectedType?.label || "Content"}...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Content
          </>
        )}
      </Button>
    </motion.form>
  );
}

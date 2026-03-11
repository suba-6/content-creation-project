import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Video, Upload, Sparkles, Loader2, Target, BookOpen, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import VideoStudioResult from "../components/video/VideoStudioResult";

const TEMPLATES = [
  { id: "promotional", label: "Promotional", icon: Target, desc: "Product launch, ads, sales", color: "from-orange-500 to-amber-500", active: "bg-orange-50 border-orange-300" },
  { id: "educational", label: "Educational", icon: BookOpen, desc: "Tutorials, how-tos, explainers", color: "from-blue-500 to-cyan-500", active: "bg-blue-50 border-blue-300" },
  { id: "entertaining", label: "Entertaining", icon: Star, desc: "Fun, viral, engaging content", color: "from-pink-500 to-rose-500", active: "bg-pink-50 border-pink-300" },
];

export default function VideoStudio() {
  const [template, setTemplate] = useState("promotional");
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [brandName, setBrandName] = useState("");
  const [tagline, setTagline] = useState("");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setPhotoUrl(file_url);
    setIsUploading(false);
    toast.success("Photo uploaded!");
  };

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    setIsGenerating(true);
    setResult(null);

    const record = await base44.entities.GeneratedContent.create({
      topic, content_type: "video_script", status: "generating",
      title: `Generating video concept for ${topic}...`,
    });

    const t = TEMPLATES.find(x => x.id === template);
    const [scriptRes, imageRes] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional video director. Create a complete ${t.label} video concept for: "${topic}".
${brandName ? `Brand: ${brandName}.` : ""} ${tagline ? `Tagline: "${tagline}".` : ""}
${details ? `Context: ${details}.` : ""}

Include:
1. Compelling video title, duration (30s/60s/90s), target audience, tone
2. Storyboard (5-8 scenes), each with: setting, camera angle (close-up/wide/overhead/tracking/POV), voiceover text, on-screen text overlays, transition style
3. Background music genre & mood
4. Color palette & visual style
5. Call to action

Format in clean markdown with clear sections.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            duration: { type: "string" },
            target_audience: { type: "string" },
            tone: { type: "string" },
            script: { type: "string" },
          },
        },
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Cinematic ${t.label.toLowerCase()} video thumbnail for: ${topic}. ${brandName ? `Brand: ${brandName}.` : ""} ${details || ""} Style: ${template === "promotional" ? "bold, energetic, commercial" : template === "educational" ? "clean, informative, professional" : "fun, vibrant, engaging"}. High production quality cinematic lighting.`,
        existing_image_urls: photoUrl ? [photoUrl] : undefined,
      }),
    ]);

    const generated = {
      title: scriptRes.title, output_url: imageRes.url, text_content: scriptRes.script,
      metadata: { duration: scriptRes.duration, target_audience: scriptRes.target_audience, tone: scriptRes.tone, template, brand_name: brandName, tagline, user_photo: photoUrl },
    };

    await base44.entities.GeneratedContent.update(record.id, { ...generated, status: "completed" });
    setResult({ ...record, ...generated, status: "completed" });
    toast.success("Video concept generated!");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" size="sm" className="mb-4 text-orange-600 hover:bg-orange-50 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </Link>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 p-8 mb-8 text-white shadow-xl shadow-orange-200">
          <img src="https://images.unsplash.com/photo-1536240478700-b869ad10e2ab?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Video Studio</h1>
            <p className="text-white/75 text-sm">AI-powered video concepts with storyboards, camera angles & scripts</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Video Template</Label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map(t => {
                const Icon = t.icon;
                return (
                  <button key={t.id} onClick={() => setTemplate(t.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${template === t.id ? t.active : "border-slate-100 hover:border-slate-200"}`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="font-semibold text-slate-800 text-xs">{t.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5 hidden sm:block">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Topic / Subject *</Label>
              <Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Summer fitness challenge, New product launch..." className="rounded-xl border-slate-200" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Additional Details</Label>
              <Textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Key messages, target audience, special requirements..." rows={2} className="rounded-xl border-slate-200 resize-none" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5 space-y-4">
            <Label className="text-sm font-semibold text-slate-700 block">Custom Branding</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Brand Name</Label>
                <Input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="Your Company" className="rounded-xl border-slate-200" />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Tagline</Label>
                <Input value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Your slogan" className="rounded-xl border-slate-200" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-2 block">Upload Your Photo (optional — used as visual reference)</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => e.preventDefault()}
                onDrop={e => { e.preventDefault(); handlePhotoUpload(e.dataTransfer.files[0]); }}
                className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Uploaded" className="h-20 w-full object-cover rounded-lg" />
                ) : isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-orange-400 mx-auto" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                    <p className="text-slate-500 text-sm">Drop photo here or click to browse</p>
                  </>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e.target.files[0])} />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-orange-200 border-0"
          >
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating Concept...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Video Concept</>}
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-orange-100 shadow-sm p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-4">Your Video Concept</h2>
                <VideoStudioResult content={result} />
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                  <Button onClick={() => setResult(null)} variant="outline" className="rounded-lg flex-1">Create Another</Button>
                  <Link to={createPageUrl("History")} className="flex-1">
                    <Button variant="ghost" className="rounded-lg w-full text-orange-600">View Library</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

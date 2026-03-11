import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, BookOpen, Upload, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import BrochureResult from "../components/brochure/BrochureResult";

const TEMPLATES = [
  { id: "single", label: "Single Page", desc: "One-pager flyer", symbol: "▭" },
  { id: "bifold", label: "Bi-fold", desc: "2-panel design", symbol: "⊞" },
  { id: "trifold", label: "Tri-fold", desc: "3-panel layout", symbol: "☰" },
];

export default function BrochureDesign() {
  const [template, setTemplate] = useState("single");
  const [headline, setHeadline] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [contact, setContact] = useState("");
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
    if (!headline.trim()) { toast.error("Please enter a headline"); return; }
    setIsGenerating(true);
    setResult(null);

    const record = await base44.entities.GeneratedContent.create({
      topic: headline, content_type: "pamphlet", status: "generating",
      title: `Designing ${template} brochure for ${headline}...`,
    });

    const t = TEMPLATES.find(x => x.id === template);
    const [contentRes, imageRes] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional graphic designer and copywriter. Create complete ${t.label} brochure content for: "${headline}".
${description ? `About: ${description}` : ""} ${features ? `Key features: ${features}` : ""} ${contact ? `Contact: ${contact}` : ""}

Layout: ${template === "trifold" ? "Tri-fold (front cover, 3-column inside spread, back panel)" : template === "bifold" ? "Bi-fold (front cover, inside spread, back)" : "Single-page flyer (header, body, footer)"}

Include:
1. Compelling headline for cover
2. Subheadline
3. Engaging intro paragraph
4. Key benefits/features with descriptions (bullet points)
5. ${template === "trifold" ? "Three distinct panel sections" : template === "bifold" ? "Two panel sections" : "Main body sections"}
6. Special offer or promotion (if relevant)
7. Call-to-action & contact section
8. Tagline

Format in clear markdown with section headers. Make it professional and print-ready.`,
        response_json_schema: {
          type: "object",
          properties: { title: { type: "string" }, content: { type: "string" } },
        },
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Professional elegant ${t.label} brochure cover design for: ${headline}. ${description || ""} Style: clean, modern, print-ready marketing material, rich professional colors, beautiful typography layout.`,
        existing_image_urls: photoUrl ? [photoUrl] : undefined,
      }),
    ]);

    const generated = {
      title: contentRes.title, output_url: imageRes.url, text_content: contentRes.content,
      metadata: { template, format: "brochure", headline, contact, user_photo: photoUrl },
    };

    await base44.entities.GeneratedContent.update(record.id, { ...generated, status: "completed" });
    setResult({ ...record, ...generated, status: "completed" });
    toast.success("Brochure generated!");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" size="sm" className="mb-4 text-blue-600 hover:bg-blue-50 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </Link>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-500 p-8 mb-8 text-white shadow-xl shadow-blue-200">
          <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Brochure Design</h1>
            <p className="text-white/75 text-sm">Professional bi-fold, tri-fold & single-page print-ready layouts</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Layout Template</Label>
            <div className="grid grid-cols-3 gap-3">
              {TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setTemplate(t.id)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${template === t.id ? "border-blue-400 bg-blue-50" : "border-slate-100 hover:border-blue-200"}`}
                >
                  <div className="text-2xl mb-2 text-slate-600">{t.symbol}</div>
                  <p className="font-semibold text-slate-800 text-xs">{t.label}</p>
                  <p className="text-slate-500 text-xs mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 space-y-4">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Headline / Topic *</Label>
              <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Summer Sale 2025, Our Services, Company Overview" className="rounded-xl border-slate-200" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Description</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your product, service, or event..." rows={2} className="rounded-xl border-slate-200 resize-none" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Key Features / Highlights</Label>
              <Textarea value={features} onChange={e => setFeatures(e.target.value)} placeholder="List main benefits or talking points..." rows={2} className="rounded-xl border-slate-200 resize-none" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Contact Information</Label>
              <Input value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone, email, website, address..." className="rounded-xl border-slate-200" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Upload Brand Photo (optional)</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handlePhotoUpload(e.dataTransfer.files[0]); }}
              className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all"
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Uploaded" className="h-20 w-full object-cover rounded-lg" />
              ) : isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-400 mx-auto" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-slate-500 text-sm">Drop photo here or click to browse</p>
                  <p className="text-slate-400 text-xs mt-1">PNG, JPG, WEBP</p>
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handlePhotoUpload(e.target.files[0])} />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !headline.trim()}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-lg shadow-blue-200 border-0"
          >
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Designing Brochure...</> : <><Sparkles className="w-4 h-4 mr-2" />Generate Brochure</>}
          </Button>

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-4">Your Brochure</h2>
                <BrochureResult content={result} />
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                  <Button onClick={() => setResult(null)} variant="outline" className="rounded-lg flex-1">Design Another</Button>
                  <Link to={createPageUrl("History")} className="flex-1">
                    <Button variant="ghost" className="rounded-lg w-full text-blue-600">View Library</Button>
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

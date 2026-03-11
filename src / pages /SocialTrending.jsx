import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, TrendingUp, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import SocialResult from "../components/social/SocialResult";

const PLATFORMS = [
  { id: "TikTok", emoji: "🎵" },
  { id: "Instagram Reels", emoji: "📸" },
  { id: "YouTube Shorts", emoji: "▶️" },
];

const GENRES = [
  { id: "comedy", label: "😂 Comedy" },
  { id: "educational", label: "📚 Educational" },
  { id: "motivational", label: "💪 Motivational" },
  { id: "product_review", label: "⭐ Product Review" },
  { id: "dance", label: "💃 Dance" },
  { id: "lip_sync", label: "🎤 Lip-Sync" },
];

export default function SocialTrending() {
  const [platform, setPlatform] = useState("TikTok");
  const [genre, setGenre] = useState("educational");
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error("Please enter a topic"); return; }
    setIsGenerating(true);
    setResult(null);

    const record = await base44.entities.GeneratedContent.create({
      topic, content_type: "social_content", status: "generating",
      title: `Generating ${platform} ${genre} content for ${topic}...`,
    });

    const genreLabel = GENRES.find(g => g.id === genre)?.label.replace(/[^\w\s]/g, "").trim() || genre;

    const [contentRes, imageRes] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert viral social media content creator. Create a complete ${genreLabel} video concept for ${platform} about: "${topic}".

Create a full content package:
1. Catchy video title
2. Hook (first 3 seconds that stop the scroll — be very specific)
3. Full scene-by-scene script with: scene description, camera angle (close-up/wide/overhead/tracking/POV), dialogue/voiceover, on-screen captions, transitions
4. Background music suggestions (genre, mood, BPM range, trending audio style)
5. Visual aesthetic & filter recommendations
6. 15-20 hashtags (mix trending + niche)
7. Best posting times for ${platform}
8. Current trend insights for this topic/niche

Format clearly in markdown. Make it genuinely viral-worthy.`,
        add_context_from_internet: true,
        model: "gemini_3_flash",
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            hook: { type: "string" },
            script: { type: "string" },
            hashtags: { type: "array", items: { type: "string" } },
            music_suggestions: { type: "string" },
            posting_times: { type: "string" },
          },
        },
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Vibrant eye-catching social media thumbnail for a ${genre.replace("_", " ")} ${platform} video about: ${topic}. Style: trendy, high contrast, ${genre === "comedy" ? "fun and playful" : genre === "motivational" ? "powerful and inspiring" : genre === "dance" ? "energetic and dynamic" : "engaging and modern"}, vertical format for mobile screens.`,
      }),
    ]);

    const generated = {
      title: contentRes.title, output_url: imageRes.url, text_content: contentRes.script,
      metadata: {
        platform, genre,
        hook: contentRes.hook,
        hashtags: contentRes.hashtags || [],
        music_suggestions: contentRes.music_suggestions,
        posting_times: contentRes.posting_times,
      },
    };

    await base44.entities.GeneratedContent.update(record.id, { ...generated, status: "completed" });
    setResult({ ...record, ...generated, status: "completed" });
    toast.success("Viral content package ready!");
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="ghost" size="sm" className="mb-4 text-pink-600 hover:bg-pink-50 rounded-lg">
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </Link>

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-500 via-rose-500 to-red-400 p-8 mb-8 text-white shadow-xl shadow-pink-200">
          <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Social Trending</h1>
            <p className="text-white/75 text-sm">Generate viral content with real-time trends, hashtags & posting times</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Platform</Label>
            <div className="grid grid-cols-3 gap-3">
              {PLATFORMS.map(p => (
                <button key={p.id} onClick={() => setPlatform(p.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${platform === p.id ? "border-pink-400 bg-pink-50" : "border-slate-100 hover:border-pink-200"}`}
                >
                  <div className="text-2xl mb-1">{p.emoji}</div>
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{p.id}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-3 block">Content Genre</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GENRES.map(g => (
                <button key={g.id} onClick={() => setGenre(g.id)}
                  className={`p-2.5 rounded-xl text-sm font-medium transition-all text-left ${genre === g.id ? "bg-pink-100 text-pink-700 border-2 border-pink-300" : "bg-slate-50 text-slate-600 border-2 border-transparent hover:border-pink-200"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Topic / Niche *</Label>
            <Input
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Morning routine, Budget travel hacks, 5-minute recipes..."
              className="rounded-xl border-slate-200"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating || !topic.trim()}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold shadow-lg shadow-pink-200 border-0"
          >
            {isGenerating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing Trends...</> : <><TrendingUp className="w-4 h-4 mr-2" />Generate Viral Content</>}
          </Button>

          {isGenerating && (
            <p className="text-xs text-center text-slate-400">Using real-time trend data — this may take a moment...</p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6"
              >
                <h2 className="text-lg font-bold text-slate-800 mb-4">Your Viral Content Package</h2>
                <SocialResult content={result} />
                <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                  <Button onClick={() => setResult(null)} variant="outline" className="rounded-lg flex-1">Create Another</Button>
                  <Link to={createPageUrl("History")} className="flex-1">
                    <Button variant="ghost" className="rounded-lg w-full text-pink-600">View Library</Button>
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

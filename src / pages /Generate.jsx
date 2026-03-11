import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { toast } from "sonner";
import GeneratorForm from "../components/generator/GeneratorForm";
import BannerPreview from "../components/content/BannerPreview";
import VideoScriptPreview from "../components/content/VideoScriptPreview";
import PamphletPreview from "../components/content/PamphletPreview";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Generate() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const generateBanner = async (topic, details) => {
    const imagePrompt = `Create a professional, eye-catching marketing banner for: ${topic}. ${details ? `Additional context: ${details}.` : ""} The design should be modern, clean, and suitable for digital marketing. Use vibrant colors, bold typography-style elements, and professional composition. Make it visually striking and memorable.`;

    const titleRes = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a short, catchy marketing title (max 8 words) for a banner about: ${topic}`,
      response_json_schema: {
        type: "object",
        properties: { title: { type: "string" } },
      },
    });

    const { url } = await base44.integrations.Core.GenerateImage({
      prompt: imagePrompt,
    });

    return {
      title: titleRes.title,
      output_url: url,
      text_content: null,
      metadata: { style: "modern digital marketing" },
    };
  };

  const generateVideoScript = async (topic, details) => {
    const [res, imageRes] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional video marketing scriptwriter. Create a detailed promotional video script for: "${topic}". ${details ? `Additional context: ${details}.` : ""}
      
      Include:
      1. A catchy title
      2. Video duration recommendation
      3. Target audience
      4. Tone/style
      5. Full script broken into scenes with:
         - Scene number and description
         - Visual direction (what appears on screen)
         - Voiceover/narration text
         - On-screen text suggestions
         - Background music mood
      6. Call to action at the end
      
      Format the script in clean markdown with clear sections.`,
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
        prompt: `Create a stunning cinematic thumbnail/storyboard visual for a promotional video about: ${topic}. ${details || ""} Style: cinematic, dramatic lighting, high production quality, suitable as a video thumbnail.`,
      }),
    ]);

    return {
      title: res.title,
      output_url: imageRes.url,
      text_content: res.script,
      metadata: {
        duration: res.duration,
        target_audience: res.target_audience,
        tone: res.tone,
      },
    };
  };

  const generatePamphlet = async (topic, details) => {
    const [textRes, imageRes] = await Promise.all([
      base44.integrations.Core.InvokeLLM({
        prompt: `You are a professional marketing copywriter. Create complete pamphlet/flyer content for: "${topic}". ${details ? `Additional context: ${details}.` : ""}
      
      Include:
      1. A compelling headline
      2. Subheadline
      3. Key features/benefits (3-5 bullet points)
      4. Detailed description paragraph
      5. Special offer or promotion (if relevant)
      6. Contact/CTA section
      7. Tagline
      
      Format in clean markdown. Make it persuasive and professional.`,
        response_json_schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
          },
        },
      }),
      base44.integrations.Core.GenerateImage({
        prompt: `Create a professional, clean marketing visual for a pamphlet/flyer about: ${topic}. ${details || ""} Style: minimalist, professional, suitable for print marketing. High quality photography or illustration style.`,
      }),
    ]);

    return {
      title: textRes.title,
      output_url: imageRes.url,
      text_content: textRes.content,
      metadata: { format: "pamphlet" },
    };
  };

  const handleGenerate = async ({ topic, details, contentType }) => {
    setIsGenerating(true);
    setResult(null);

    // Create a placeholder record
    const record = await base44.entities.GeneratedContent.create({
      topic,
      content_type: contentType,
      status: "generating",
      title: `Generating ${contentType} for ${topic}...`,
    });

    try {
      let generated;
      switch (contentType) {
        case "banner":
          generated = await generateBanner(topic, details);
          break;
        case "video_script":
          generated = await generateVideoScript(topic, details);
          break;
        case "pamphlet":
          generated = await generatePamphlet(topic, details);
          break;
      }

      await base44.entities.GeneratedContent.update(record.id, {
        ...generated,
        status: "completed",
      });

      setResult({ ...record, ...generated, status: "completed" });
      toast.success("Content generated successfully!");
    } catch (err) {
      await base44.entities.GeneratedContent.update(record.id, {
        status: "failed",
      });
      toast.error("Generation failed. Please try again.");
      setResult(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    switch (result.content_type) {
      case "banner":
        return <BannerPreview content={result} />;
      case "video_script":
        return <VideoScriptPreview content={result} />;
      case "pamphlet":
        return <PamphletPreview content={result} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-fuchsia-50/30 to-white">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="sm" className="rounded-lg mb-4 text-violet-600 hover:bg-violet-50">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 p-8 mb-6 text-white shadow-xl shadow-fuchsia-200">
            <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80" alt="" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">Create Content</h1>
              <p className="text-white/70 text-sm">Generate stunning marketing materials with AI</p>
            </div>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-2xl border border-violet-100 shadow-lg shadow-violet-50 p-6 sm:p-8">
          <GeneratorForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8"
            >
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Generated Result
              </h2>
              {renderResult()}
              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
                <Button
                  onClick={() => setResult(null)}
                  variant="outline"
                  className="rounded-lg"
                >
                  Generate Another
                </Button>
                <Link to={createPageUrl("History")}>
                  <Button variant="ghost" className="rounded-lg text-indigo-600">
                    View All Content
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

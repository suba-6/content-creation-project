import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ArrowRight, Loader2, Zap, Video, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import StatsBar from "../components/dashboard/StatsBar";
import ContentCard from "../components/content/ContentCard";
import ContentDetailModal from "../components/content/ContentDetailModal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const [selectedContent, setSelectedContent] = React.useState(null);
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["generated-contents"],
    queryFn: () => base44.entities.GeneratedContent.list("-created_date", 100),
  });

  const recentContents = contents.slice(0, 6);

  const handleDelete = async (id) => {
    await base44.entities.GeneratedContent.delete(id);
    queryClient.invalidateQueries({ queryKey: ["generated-contents"] });
    setSelectedContent(null);
    toast.success("Content deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8 text-white min-h-[260px] sm:min-h-[300px]"
        >
          {/* Background photo */}
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-700/90 via-violet-700/80 to-indigo-800/90" />

          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-pink-400/20 rounded-full -translate-y-1/3 translate-x-1/3 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-cyan-400/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-2xl" />

          <div className="relative z-10 p-8 sm:p-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-300" />
              </div>
              <span className="text-pink-200 text-sm font-semibold tracking-wide uppercase">AI-Powered Studio</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 leading-tight">
              Marketing Content<br className="hidden sm:block" /> at the Speed of AI
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-md mb-7">
              Generate stunning banners, video scripts & pamphlets for your business in seconds.
            </p>
            <Link to={createPageUrl("Generate")}>
              <Button className="bg-gradient-to-r from-pink-400 to-fuchsia-400 hover:from-pink-500 hover:to-fuchsia-500 text-white rounded-xl h-11 px-7 font-bold shadow-xl shadow-fuchsia-900/30 border-0">
                <Sparkles className="w-4 h-4 mr-2" />
                Create New Content
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Create Content</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Generate", label: "Banners & Scripts", desc: "Banners, video scripts, pamphlets", icon: Sparkles, gradient: "from-indigo-500 to-violet-500", bg: "bg-indigo-50 border-indigo-100" },
              { name: "VideoStudio", label: "Video Studio", desc: "AI storyboards & concepts", icon: Video, gradient: "from-orange-500 to-amber-500", bg: "bg-orange-50 border-orange-100" },
              { name: "BrochureDesign", label: "Brochure Design", desc: "Bi-fold, tri-fold layouts", icon: BookOpen, gradient: "from-blue-500 to-cyan-500", bg: "bg-blue-50 border-blue-100" },
              { name: "SocialTrending", label: "Social Trending", desc: "Viral content & hashtags", icon: TrendingUp, gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50 border-pink-100" },
            ].map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.name} to={createPageUrl(tool.name)}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`p-4 rounded-2xl border ${tool.bg} cursor-pointer h-full`}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-3`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{tool.label}</p>
                    <p className="text-slate-500 text-xs mt-0.5 leading-snug">{tool.desc}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        {!isLoading && contents.length > 0 && (
          <div className="mb-8">
            <StatsBar contents={contents} />
          </div>
        )}

        {/* Recent Content */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">Recent Content</h2>
          {contents.length > 6 && (
            <Link to={createPageUrl("History")}>
              <Button variant="ghost" size="sm" className="text-indigo-600 rounded-lg">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : recentContents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-white rounded-2xl border border-slate-100"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-slate-500 font-medium">No content yet</p>
            <p className="text-slate-400 text-sm mt-1 mb-4">
              Create your first marketing material
            </p>
            <Link to={createPageUrl("Generate")}>
              <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                Get Started
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentContents.map((content, i) => (
              <ContentCard
                key={content.id}
                content={content}
                index={i}
                onClick={() => setSelectedContent(content)}
              />
            ))}
          </div>
        )}
      </div>

      <ContentDetailModal
        content={selectedContent}
        open={!!selectedContent}
        onClose={() => setSelectedContent(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}

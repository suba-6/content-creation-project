import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search, Loader2, FolderOpen } from "lucide-react";
import { motion } from "framer-motion";
import ContentCard from "../components/content/ContentCard";
import ContentDetailModal from "../components/content/ContentDetailModal";
import { toast } from "sonner";

export default function History() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedContent, setSelectedContent] = useState(null);
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["generated-contents"],
    queryFn: () => base44.entities.GeneratedContent.list("-created_date", 100),
  });

  const filtered = contents.filter((c) => {
    const matchesSearch =
      !search ||
      c.topic?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.content_type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id) => {
    await base44.entities.GeneratedContent.delete(id);
    queryClient.invalidateQueries({ queryKey: ["generated-contents"] });
    setSelectedContent(null);
    toast.success("Content deleted");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="sm" className="rounded-lg mb-4 text-slate-500">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Content Library
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            All your generated marketing materials
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search content..."
              className="pl-10 h-10 rounded-xl border-slate-200"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-white border border-slate-100 rounded-xl h-10">
              <TabsTrigger value="all" className="rounded-lg text-xs">All</TabsTrigger>
              <TabsTrigger value="banner" className="rounded-lg text-xs">Banners</TabsTrigger>
              <TabsTrigger value="video_script" className="rounded-lg text-xs">Scripts</TabsTrigger>
              <TabsTrigger value="pamphlet" className="rounded-lg text-xs">Pamphlets</TabsTrigger>
              <TabsTrigger value="social_content" className="rounded-lg text-xs">Social</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <FolderOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">No content found</p>
            <p className="text-slate-300 text-sm mt-1">
              {search ? "Try a different search" : "Generate your first piece of content"}
            </p>
            {!search && (
              <Link to={createPageUrl("Generate")}>
                <Button className="mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  Create Content
                </Button>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((content, i) => (
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

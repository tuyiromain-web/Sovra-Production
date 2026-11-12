/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  MessageSquare, User, Clock, ChevronUp, CornerDownRight, Send, 
  Plus, Pin, Shield, MessageCirclePlus, Search, BookmarkCheck,
  Sparkles, Flame
} from "lucide-react";
import { UserProfile, ForumPost, ForumReply } from "../types";

interface ForumTabProps {
  currentUser: UserProfile;
  forumPosts: ForumPost[];
  onAddPost: (newPost: Omit<ForumPost, "id" | "upvotes" | "replies" | "authorName" | "authorRole" | "authorId" | "createdAt">) => void;
  onAddReply: (postId: string, content: string) => void;
  onUpvotePost: (postId: string) => void;
}

export default function ForumTab({
  currentUser,
  forumPosts,
  onAddPost,
  onAddReply,
  onUpvotePost
}: ForumTabProps) {
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Create Post State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumPost["category"]>("Pharmacology");

  // Create Reply State
  const [replyContent, setReplyContent] = useState("");

  const categories: string[] = ["All", "Pharmacology", "Pharmaceutics", "Medicinal Chemistry", "Pharmacognosy", "General"];

  // Filter posts
  const filteredPosts = forumPosts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === "All" || post.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill in both the Title and the content body.");
      return;
    }

    onAddPost({
      title,
      content,
      category,
      isPinned: false
    });

    setTitle("");
    setContent("");
    setShowCreateForm(false);
  };

  const handleCreateReplySubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    onAddReply(postId, replyContent);
    
    const updatedPost = forumPosts.find(p => p.id === postId);
    if (updatedPost) {
      setSelectedPost(updatedPost);
    }

    setReplyContent("");
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Class Representative":
        return "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30 font-mono text-[9px]";
      case "Lecturer":
        return "bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30 font-mono text-[9px]";
      case "Admin":
        return "bg-[#EC407A]/15 text-[#EC407A] border-[#EC407A]/30 font-mono text-[9px]";
      default:
        return "bg-[#1E232B] text-[#94A3B8] border-white/8 font-mono text-[9px]";
    }
  };

  const formatTime = (timeStr: string) => {
    const diffMs = new Date().getTime() - new Date(timeStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return new Date(timeStr).toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div id="forum-tab-section" className="space-y-6 animate-fade-in text-[#F8FAFC]">
      
      {/* Search and Category Filter Strip */}
      <div className="bg-glass rounded-2xl border border-white/8 p-5 space-y-4 shadow-md text-left">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search pharmacy discussions, formulas, lecture questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0E1626] border border-white/8 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] placeholder:text-[#64748B] transition-all"
            />
          </div>

          <button
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setSelectedPost(null);
            }}
            className="blue-gradient-btn text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer text-xs shadow-md glow-blue-sm whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create Thread</span>
          </button>
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/8">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mr-2 font-mono flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Modules:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
                  filterCategory === cat
                    ? "bg-[#0284C7] text-white border-[#0284C7] shadow-xs"
                    : "bg-[#0E1626] text-[#94A3B8] border-white/8 hover:text-[#F8FAFC] hover:bg-[#191D23]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Forum Split view */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left column: Feed of posts */}
        <div className={`xl:col-span-2 space-y-4 ${selectedPost ? "hidden xl:block" : "block"}`}>
          
          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-glass rounded-2xl border border-[#0284C7]/40 p-6 space-y-4 animate-fade-in text-left shadow-xl">
              <div className="border-b border-white/8 pb-3 flex justify-between items-center">
                <h3 className="font-bold text-base text-[#F8FAFC] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                  <span>Launch New Discussion Thread</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs font-mono text-[#94A3B8] hover:text-white uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreatePostSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Topic Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  >
                    <option value="Pharmacology">Pharmacology</option>
                    <option value="Pharmaceutics">Pharmaceutics</option>
                    <option value="Medicinal Chemistry">Medicinal Chemistry</option>
                    <option value="Pharmacognosy">Pharmacognosy</option>
                    <option value="General">General / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Title / Question *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Mechanism of drug absorption in gastric vs intestinal environments"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#94A3B8] mb-1.5 uppercase tracking-wider font-mono">Content / Clinical Details *</label>
                  <textarea
                    required
                    placeholder="Describe your pharmaceutical question or concept in detail. Be as specific as possible so classmates or lecturers can give targeted replies."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-[#0E1626] border border-white/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] h-28 resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-white/8">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-[#94A3B8] hover:text-white text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 blue-gradient-btn text-white font-bold rounded-xl text-xs cursor-pointer shadow-md glow-blue-sm"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts Feed list */}
          <div className="space-y-3">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const isSelected = selectedPost?.id === post.id;
                return (
                  <div
                    key={post.id}
                    onClick={() => {
                      setSelectedPost(post);
                      setShowCreateForm(false);
                    }}
                    className={`bg-glass rounded-2xl border p-5 transition-all duration-200 cursor-pointer text-left relative flex gap-4 ${
                      isSelected
                        ? "border-[#0284C7] bg-[#191D23] shadow-md ring-1 ring-[#0284C7]/40"
                        : "border-white/8 hover:border-[#0284C7]/40 hover:bg-[#0E1626]"
                    }`}
                  >
                    {/* Upvote side panel */}
                    <div className="flex flex-col items-center justify-start shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvotePost(post.id);
                        }}
                        className="p-2 bg-[#0E1626] hover:bg-[#1E232B] text-[#94A3B8] hover:text-[#38BDF8] rounded-xl border border-white/6 flex flex-col items-center gap-0.5 cursor-pointer group transition-colors"
                      >
                        <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform text-[#38BDF8]" />
                        <span className="text-xs font-bold font-mono text-[#F8FAFC]">{post.upvotes}</span>
                      </button>
                    </div>

                    {/* Thread Details */}
                    <div className="space-y-2.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[10px]">
                        <span className="text-[#38BDF8] font-bold bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded-md font-mono uppercase text-[9px]">
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="text-[#F59E0B] font-bold bg-[#F59E0B]/15 px-2 py-0.5 rounded-md flex items-center gap-0.5 border border-[#F59E0B]/30 font-mono text-[9px] uppercase">
                            <Pin className="w-2.5 h-2.5 shrink-0" />
                            Pinned
                          </span>
                        )}
                        <span className="text-[#64748B] font-mono">•</span>
                        <span className={`px-2 py-0.5 border rounded-md font-mono ${getRoleBadgeColor(post.authorRole)}`}>
                          {post.authorName}
                        </span>
                        <span className="text-[#64748B] font-mono">
                          {formatTime(post.createdAt)}
                        </span>
                      </div>

                      <h4 className="font-bold text-[#F8FAFC] text-sm leading-snug hover:text-[#38BDF8] transition-colors truncate">
                        {post.title}
                      </h4>

                      <p className="text-[#94A3B8] text-xs leading-relaxed line-clamp-2">
                        {post.content}
                      </p>

                      <div className="flex items-center gap-2.5 text-[10px] text-[#64748B] font-mono pt-2 border-t border-white/6">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-[#38BDF8]" />
                          {post.replies.length} replies
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-glass rounded-2xl border border-white/8 p-16 text-center space-y-4">
                <div className="p-4 bg-[#0E1626] border border-white/8 rounded-2xl text-[#64748B] inline-block">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-sm text-[#F8FAFC]">No threads available</h4>
                <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">Be the first to ask a question! Click &quot;Create Thread&quot; to connect with your pharmacy colleagues.</p>
              </div>
            )}
          </div>

        </div>

        {/* Right column: Thread Conversation details */}
        <div className={`space-y-4 ${selectedPost ? "block" : "hidden xl:block"}`}>
          {selectedPost ? (
            <div className="bg-glass rounded-2xl border border-white/8 p-5 space-y-4 animate-fade-in text-left shadow-xl">
              {/* Back button for mobile view */}
              <button
                onClick={() => setSelectedPost(null)}
                className="xl:hidden text-xs text-[#38BDF8] font-mono font-bold mb-2 flex items-center gap-1 cursor-pointer"
              >
                &larr; Back to Forum Feed
              </button>

              <div className="border-b border-white/8 pb-3">
                <div className="flex items-center gap-2 text-[10px] mb-2">
                  <span className="text-[#38BDF8] font-bold bg-[#0284C7]/15 border border-[#0284C7]/30 px-2 py-0.5 rounded-md font-mono uppercase">
                    {selectedPost.category}
                  </span>
                  <span className="text-[#64748B] font-mono">{formatTime(selectedPost.createdAt)}</span>
                </div>
                <h3 className="font-bold text-[#F8FAFC] text-sm leading-snug">{selectedPost.title}</h3>
                
                <div className="flex items-center gap-1.5 mt-2.5">
                  <span className={`text-[9px] px-2 py-0.5 border rounded-md font-mono ${getRoleBadgeColor(selectedPost.authorRole)}`}>
                    {selectedPost.authorName} ({selectedPost.authorRole})
                  </span>
                </div>
              </div>

              {/* Thread core content */}
              <p className="text-[#CBD5E1] text-xs leading-relaxed bg-[#0E1626] p-4 border border-white/6 rounded-xl whitespace-pre-wrap">
                {selectedPost.content}
              </p>

              {/* Nested replies section */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-[10px] text-[#94A3B8] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CornerDownRight className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Replies ({selectedPost.replies.length})</span>
                </h4>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {selectedPost.replies.length > 0 ? (
                    selectedPost.replies.map((reply) => (
                      <div key={reply.id} className="p-3.5 bg-[#0E1626] border border-white/6 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[9px] text-[#64748B]">
                          <span className={`px-2 py-0.5 border rounded-md font-mono ${getRoleBadgeColor(reply.authorRole)}`}>
                            {reply.authorName} ({reply.authorRole})
                          </span>
                          <span className="font-mono">{formatTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-[#CBD5E1] text-xs leading-relaxed">{reply.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-[#64748B] italic py-3 text-center font-mono">No replies yet. Be the first to share your thoughts below!</p>
                  )}
                </div>
              </div>

              {/* Form to submit reply */}
              <form onSubmit={(e) => handleCreateReplySubmit(e, selectedPost.id)} className="pt-3 border-t border-white/8 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your pharmaceutical reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="flex-1 bg-[#0E1626] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#0284C7] text-[#F8FAFC] placeholder:text-[#64748B]"
                />
                <button
                  type="submit"
                  disabled={!replyContent.trim()}
                  className="p-2.5 blue-gradient-btn text-white rounded-xl disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-glass rounded-2xl border border-white/8 p-8 text-center space-y-3 flex flex-col items-center justify-center min-h-[300px]">
              <div className="p-3 bg-[#0E1626] border border-white/8 rounded-xl text-[#64748B]">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-[#F8FAFC] text-sm">Select Conversation Thread</h4>
              <p className="text-xs text-[#94A3B8] max-w-[200px] leading-relaxed">Click any question on the left to read replies, explore research citations, or contribute answers.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

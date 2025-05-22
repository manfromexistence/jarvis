"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "components/ui/button";
import { aiService } from "@/lib/services/ai-service";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Radio, Globe, Paperclip, ArrowUp, CircleDotDashed, Lightbulb, ImageIcon, ChevronDown, Check, YoutubeIcon, FolderCogIcon, Upload, Link2, PackageOpen, NotebookPen, Sparkles, X, File, FolderPlus, Plus, Play, StopCircle, Search, Microscope, Pen, PenTool } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { doc, updateDoc, collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Separator } from '@/components/ui/separator'
import { useCategorySidebar } from '@/components/category-sidebar'
import { useSubCategorySidebar } from '@/components/subcategory-sidebar'
import CategorySidebar from '@/components/category-app-sidebar'
import SubCategorySidebar from '@/components/subcategory-app-sidebar'

import {
  MessageCircle,
  Type,
} from 'lucide-react'

interface AIModel {
  value: string;
  label: string;
  hasSearch?: boolean;
  hasThinking?: boolean;
  hasImageGen?: boolean;
}

const ais: AIModel[] = [
  {
    value: "gemini-2.5-pro-exp-03-25",
    label: "Gemini 2.5 Pro (Experimental)",
    hasSearch: true,
    hasThinking: true,
    hasImageGen: false
  },
  {
    value: "gemini-2.0-flash-thinking-exp-01-21",
    label: "Gemini 2.0 Flash Thinking",
    hasSearch: false,
    hasThinking: true,
    hasImageGen: false
  },
  {
    value: "gemini-2.0-flash-exp-image-generation",
    label: "Gemini 2.0 Flash Image Gen",
    hasSearch: false,
    hasThinking: false,
    hasImageGen: true
  },
  {
    value: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
    hasSearch: true,
    hasThinking: false,
    hasImageGen: false
  },
  {
    value: "gemini-2.0-flash-lite",
    label: "Gemini 2.0 Flash Lite",
    hasSearch: false,
    hasThinking: false,
    hasImageGen: false
  },
  {
    value: "learnlm-1.5-pro-experimental",
    label: "LearnLM 1.5 Pro",
    hasSearch: false,
    hasThinking: false,
    hasImageGen: false
  },
  {
    value: "gemini-1.5-pro",
    label: "Gemini 1.5 Pro",
    hasSearch: true,
    hasThinking: false,
    hasImageGen: false
  },
  {
    value: "gemini-1.5-flash",
    label: "Gemini 1.5 Flash",
    hasSearch: true,
    hasThinking: false,
    hasImageGen: false
  },
  {
    value: "gemini-1.5-flash-8b",
    label: "Gemini 1.5 Flash 8B",
    hasSearch: false,
    hasThinking: false,
    hasImageGen: false
  }
];

interface MegaFile {
  id: string;
  name: string;
  size: number;
  type: string;
  isImage: boolean;
  timestamp?: number;
}

interface InputActionsProps {
  isLoading: boolean;
  showSearch: boolean;
  showResearch: boolean;
  showThinking: boolean;
  value: string;
  selectedAI: string;
  imagePreview: string | null;
  onSubmit: () => void;
  onSearchToggle: () => void;
  onResearchToggle: () => void;
  onThinkingToggle: () => void;
  onImageUpload: (file: File | null) => void;
  onUrlAnalysis?: (urls: string[], prompt: string, type?: string) => void;
  onImageGeneration?: (response: { text_responses: string[]; images: { image: string; mime_type: string }[]; model_used: string }) => void;
  onAIChange?: (model: string) => void;
  onInsertText?: (text: string, type: string) => void;
}

interface Project {
  id: string;
  name: string;
  createdAt: number;
}

export function InputActions({
  isLoading,
  showSearch,
  showResearch,
  showThinking,
  value,
  selectedAI,
  imagePreview,
  onSubmit,
  onSearchToggle,
  onResearchToggle,
  onThinkingToggle,
  onImageUpload,
  onUrlAnalysis,
  onImageGeneration,
  onAIChange,
  onInsertText,
}: InputActionsProps) {
  const [youtubeUrl, setYoutubeUrl] = React.useState("");
  const [aiOpen, setAiOpen] = React.useState(false);
  const [youtubeDialogOpen, setYoutubeDialogOpen] = React.useState(false);
  const [mediaUrl, setMediaUrl] = React.useState("");
  const [mediaDialogOpen, setMediaDialogOpen] = React.useState(false);
  const [localSelectedAI, setLocalSelectedAI] = React.useState<string>(selectedAI || aiService.currentModel);
  const [filePopoverOpen, setFilePopoverOpen] = React.useState(false);
  const [attachUrl, setAttachUrl] = React.useState("");
  const { toast } = useToast();

  const [activeCommandMode, setActiveCommandMode] = React.useState<string | null>(null);
  const [megaFiles, setMegaFiles] = useState<MegaFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUrlUploading, setIsUrlUploading] = useState(false);

  // Project related states
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const { statecategorysidebar, toggleCategorySidebar } = useCategorySidebar()
  const { statesubcategorysidebar, toggleSubCategorySidebar } = useSubCategorySidebar()

  const handleCategorySidebarToggle = () => {
    toggleCategorySidebar()
    if (statesubcategorysidebar === 'expanded') {
      toggleSubCategorySidebar()
    }
  }

  const handleSubCategorySidebarToggle = () => {
    toggleSubCategorySidebar()
    if (statecategorysidebar === 'expanded') {
      toggleCategorySidebar()
    }
  }

  useEffect(() => {
    const savedCommand = localStorage.getItem('activeCommand');
    if (savedCommand) {
      setActiveCommandMode(savedCommand);
    }
  }, []);

  useEffect(() => {
    if (selectedAI) {
      setLocalSelectedAI(selectedAI);
    }
  }, [selectedAI]);

  useEffect(() => {
    console.log("Setting AI model to:", localSelectedAI);
    aiService.setModel(localSelectedAI);
  }, [localSelectedAI]);

  useEffect(() => {
    if (showThinking && activeCommandMode !== 'thinking-mode') {
      setActiveCommandMode('thinking-mode');
      localStorage.setItem('activeCommand', 'thinking-mode');
    } else if (!showThinking && activeCommandMode === 'thinking-mode') {
      setActiveCommandMode(null);
      localStorage.removeItem('activeCommand');
    }
  }, [showThinking, activeCommandMode]);

  useEffect(() => {
    if (showResearch && activeCommandMode !== 'research-mode') {
      setActiveCommandMode('research-mode');
      localStorage.setItem('activeCommand', 'research-mode');
    } else if (!showResearch && activeCommandMode === 'research-mode') {
      setActiveCommandMode(null);
      localStorage.removeItem('activeCommand');
    }
  }, [showResearch, activeCommandMode]);

  // Fetch projects from Firestore
  const fetchProjects = React.useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const projectsCollection = collection(db, "projects");
      const projectsSnapshot = await getDocs(projectsCollection);
      const projectsList: Project[] = [];
      projectsSnapshot.forEach(doc => {
        projectsList.push({
          id: doc.id,
          name: doc.data().name,
          createdAt: doc.data().createdAt
        });
      });
      setProjects(projectsList.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Failed to load projects",
        description: "Unable to fetch your projects",
        variant: "destructive",
      });
    } finally {
      setIsLoadingProjects(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create a new project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingProject(true);
    try {
      const projectData = {
        name: newProjectName.trim(),
        createdAt: Date.now(),
        userId: "current-user-id", // Replace with actual user ID
      };

      const projectRef = await addDoc(collection(db, "projects"), projectData);
      const newProject = {
        id: projectRef.id,
        name: projectData.name,
        createdAt: projectData.createdAt
      };

      setProjects(prevProjects => [newProject, ...prevProjects]);
      setSelectedProject(newProject);
      setNewProjectName("");
      setProjectDialogOpen(false);

      toast({
        title: "Project created",
        description: `"${newProject.name}" has been created successfully`,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to create project",
        description: "There was an error creating your project",
        variant: "destructive",
      });
    } finally {
      setIsCreatingProject(false);
    }
  };

  // Select a project
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    toast({
      title: "Project selected",
      description: `You're now working in "${project.name}"`,
    });
  };

  const fetchMegaFiles = React.useCallback(async () => {
    setIsLoadingFiles(true);
    try {
      const response = await fetch('/api/mega/files');
      const data = await response.json();
      if (data.files) {
        setMegaFiles(data.files);
      } else {
        console.error("Error fetching MEGA files:", data.error);
        toast({
          title: "Failed to load files",
          description: data.error || "Unable to load files from MEGA",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching MEGA files:", error);
      toast({
        title: "Failed to load files",
        description: "Unable to connect to MEGA service",
        variant: "destructive",
      });
    } finally {
      setIsLoadingFiles(false);
    }
  }, [toast]);

  useEffect(() => {
    if (filePopoverOpen) {
      fetchMegaFiles();
    }
  }, [filePopoverOpen, fetchMegaFiles]);


  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('/api/mega/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Upload successful",
          description: "File was uploaded to MEGA",
          variant: "default",
        });
        fetchMegaFiles();
      } else {
        toast({
          title: "Upload failed",
          description: data.error || "Failed to upload file to MEGA",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading the file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAttachUrl = async () => {
    if (!attachUrl) {
      toast({
        title: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsUrlUploading(true);

    try {
      const response = await fetch('/api/mega/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: attachUrl }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "URL download successful",
          description: `${data.filename} was uploaded to MEGA`,
        });
        fetchMegaFiles();
        setAttachUrl("");
        setFilePopoverOpen(false);
      } else {
        toast({
          title: "URL download failed",
          description: data.error || "Failed to download and upload the URL",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error processing URL:", error);
      toast({
        title: "URL processing failed",
        description: "An error occurred while downloading the URL",
        variant: "destructive",
      });
    } finally {
      setIsUrlUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const enhancePrompt = async () => {
    if (value.trim() === "") {
      toast({
        title: "No text to enhance",
        description: "Please enter some text first",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Enhancing your prompt...",
      description: "Making your instructions clearer for the AI",
      variant: "default",
    });

    try {
      let textToEnhance = value;

      if (activeCommandMode) {
        const prefix = prefixes[activeCommandMode as keyof typeof prefixes];
        if (value.startsWith(`${prefix}: `)) {
          textToEnhance = value.substring(`${prefix}: `.length);
        }
      }

      const previousModel = aiService.currentModel;

      aiService.setModel("gemini-2.0-flash");

      const enhancementPrompt = `Please rewrite and improve the following prompt to make it clearer, more specific, and easier for an AI to understand. Focus on improving structure, specificity, and clarity. Return ONLY the improved prompt with no explanations or additional text:\n\n${textToEnhance}`;

      const response = await aiService.generateResponse(enhancementPrompt);

      aiService.setModel(previousModel);

      const enhancedPrompt = typeof response === 'string'
        ? response.trim()
        : response.text_response?.trim() || '';

      let cleanedPrompt = enhancedPrompt;
      while (cleanedPrompt.endsWith(':')) {
        cleanedPrompt = cleanedPrompt.slice(0, -1).trim();
      }

      let finalText = cleanedPrompt;
      if (activeCommandMode) {
        const prefix = prefixes[activeCommandMode as keyof typeof prefixes];
        finalText = `${prefix}: ${enhancedPrompt}`;

        while (finalText.endsWith(':')) {
          finalText = finalText.slice(0, -1).trim();
        }

        if (onInsertText) {
          onInsertText(finalText, activeCommandMode);

          setTimeout(() => {
            if (document.getElementById('ai-input')) {
              const event = new Event('input', { bubbles: true });
              document.getElementById('ai-input')?.dispatchEvent(event);
            }
          }, 50);
        }
      } else {
        if (onInsertText) {
          onInsertText(finalText, "");

          setTimeout(() => {
            if (document.getElementById('ai-input')) {
              const event = new Event('input', { bubbles: true });
              document.getElementById('ai-input')?.dispatchEvent(event);
            }
          }, 50);
        }
      }

      toast({
        title: "Prompt Enhanced",
        description: (
          <div className="mt-1">
            Your prompt has been improved
          </div>
        ),
        variant: "default",
      });
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      toast({
        title: "Enhancement failed",
        description: "Unable to enhance prompt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const prefixes = {
    'image-gen': "Image",
    'thinking-mode': "Thinking",
    'search-mode': "Search",
    'research-mode': "Research",
    'canvas-mode': "Canvas"
  };

  const handleImageSelect = async () => {
    const imageGenModel = "gemini-2.0-flash-exp-image-generation";

    setLocalSelectedAI(imageGenModel);

    setActiveCommandMode('image-gen');
    localStorage.setItem('activeCommand', 'image-gen');

    aiService.setModel(imageGenModel);

    if (onAIChange) {
      onAIChange(imageGenModel);
    }

    if (onInsertText) {
      onInsertText(`${prefixes['image-gen']}:`, 'image-gen');
    }

    localStorage.setItem("previousModel", selectedAI || "gemini-2.0-flash");

    try {
      const currentChatId = window.location.pathname.split('/').pop();
      if (currentChatId) {
        const chatRef = doc(db, "chats", currentChatId);
        await updateDoc(chatRef, { model: imageGenModel });
        console.log("Firestore model updated to:", imageGenModel);
      }
    } catch (error) {
      console.error("Failed to update Firestore model:", error);
    }

    toast({
      title: "Switched to Image Generation",
      description: "You can now generate images.",
      variant: "default",
    });

    console.log("Model switched to image generation:", imageGenModel);
  };

  const handleGoogleDriveSelect = () => {
    toast({
      title: "Google Drive integration will be available soon",
      description: "This feature is currently in development",
      variant: "default",
    });
  };

  const handleCanvasSelect = () => {
    const thinkingModel = "gemini-2.0-flash-thinking-exp-01-21";
    setLocalSelectedAI(thinkingModel);

    setActiveCommandMode('canvas-mode');
    localStorage.setItem('activeCommand', 'canvas-mode');

    if (onInsertText) {
      onInsertText(`${prefixes['canvas-mode']}:`, 'canvas-mode');
    }

    toast({
      title: "Switched to Canvas Mode",
      description: "Canvas mode activated with enhanced thinking capabilities.",
      variant: "default",
    });
  };

  const handleYoutubeUrlSubmit = () => {
    if (youtubeUrl) {
      if (onUrlAnalysis) {
        onUrlAnalysis([youtubeUrl], "Analyze this YouTube video");
        toast({
          title: "YouTube URL submitted for analysis",
          description: youtubeUrl,
        });
      }
      setYoutubeUrl("");
      setYoutubeDialogOpen(false);
    } else {
      toast({
        title: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
    }
  };

  const handleMediaUrlSubmit = () => {
    if (mediaUrl) {
      if (onUrlAnalysis) {
        onUrlAnalysis([mediaUrl], "Analyze this media");
        toast({
          title: "Media URL submitted for analysis",
          description: mediaUrl,
        });
      }
      setMediaUrl("");
      setMediaDialogOpen(false);
    } else {
      toast({
        title: "Please enter a valid URL",
        variant: "destructive",
      });
    }
  };

  const handleResearchSelect = () => {
    const thinkingModel = "gemini-2.0-flash-thinking-exp-01-21";
    setLocalSelectedAI(thinkingModel);

    setActiveCommandMode('research-mode');
    localStorage.setItem('activeCommand', 'research-mode');

    if (onInsertText) {
      onInsertText(`${prefixes['research-mode']}:`, 'research-mode');
    }

    toast({
      title: "Switched to Research Mode",
      description: "Enhanced reasoning capabilities for deep research.",
      variant: "default",
    });
  };

  const handleSearchToggle = async () => {
    const newSearchState = !showSearch;
    onSearchToggle();

    if (newSearchState) {
      localStorage.setItem("previousModel", localSelectedAI);
      const thinkingModel = "gemini-2.5-pro-exp-03-25";
      setLocalSelectedAI(thinkingModel);

      setActiveCommandMode('search-mode');
      localStorage.setItem('activeCommand', 'search-mode');

      if (onInsertText) {
        onInsertText(`${prefixes['search-mode']}:`, 'search-mode');
      }

      try {
        const currentChatId = window.location.pathname.split('/').pop();
        if (currentChatId) {
          const chatRef = doc(db, "chats", currentChatId);
          await updateDoc(chatRef, { model: thinkingModel });
          console.log("Firestore model updated to:", thinkingModel);
        }
      } catch (error) {
        console.error("Failed to update Firestore model:", error);
      }

      toast({
        title: "Smart Search Mode Activated",
        description: "Enhanced web search capabilities activated.",
        variant: "default",
      });
    } else {
      const prevModel = localStorage.getItem("previousModel") || "gemini-2.0-flash";
      setLocalSelectedAI(prevModel);

      setActiveCommandMode(null);
      localStorage.removeItem('activeCommand');

      if (value && value.startsWith("Search")) {
        if (onInsertText) {
          onInsertText("", "");
        }
      }

      try {
        const currentChatId = window.location.pathname.split('/').pop();
        if (currentChatId) {
          const chatRef = doc(db, "chats", currentChatId);
          await updateDoc(chatRef, { model: prevModel });
          console.log("Firestore model updated to:", prevModel);
        }
      } catch (error) {
        console.error("Failed to update Firestore model:", error);
      }

      toast({
        title: "Search Mode Disabled",
        description: `Restored to ${prevModel}`,
        variant: "default",
      });
    }
  };

  const handleThinkingSelect = async () => {
    const newResearchState = !showResearch;

    if (newResearchState) {
      localStorage.setItem("previousModel", localSelectedAI);
      const thinkingModel = "gemini-2.0-flash-thinking-exp-01-21";
      setLocalSelectedAI(thinkingModel);

      setActiveCommandMode('research-mode');
      localStorage.setItem('activeCommand', 'research-mode');

      if (onInsertText) {
        onInsertText(`${prefixes['research-mode']}:`, 'research-mode');
      }

      try {
        const currentChatId = window.location.pathname.split('/').pop();
        if (currentChatId) {
          const chatRef = doc(db, "chats", currentChatId);
          await updateDoc(chatRef, { model: thinkingModel });
          console.log("Firestore model updated to:", thinkingModel);
        }
      } catch (error) {
        console.error("Failed to update Firestore model:", error);
      }

      toast({
        title: "Deep Research Mode Activated",
        description: "Enhanced reasoning capabilities for deep research.",
        variant: "default",
      });
    } else {
      const prevModel = localStorage.getItem("previousModel") || "gemini-2.0-flash";
      setLocalSelectedAI(prevModel);

      setActiveCommandMode(null);
      localStorage.removeItem('activeCommand');

      if (value && value.startsWith("Research")) {
        if (onInsertText) {
          onInsertText("", "");
        }
      }

      try {
        const currentChatId = window.location.pathname.split('/').pop();
        if (currentChatId) {
          const chatRef = doc(db, "chats", currentChatId);
          await updateDoc(chatRef, { model: prevModel });
          console.log("Firestore model updated to:", prevModel);
        }
      } catch (error) {
        console.error("Failed to update Firestore model:", error);
      }

      toast({
        title: "Research Mode Disabled",
        description: `Restored to ${prevModel}`,
        variant: "default",
      });
    }
  };

  return (
    <div className="flex h-12 flex-row justify-between rounded-b-xl border-t px-2.5">
      <div className="flex h-full flex-row items-center gap-1.5">
        <div className="xs:flex hover:bg-primary-foreground hidden h-8 items-center justify-center gap-1 rounded-md border px-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleCategorySidebarToggle}
                  className="hover:bg-secondary group flex size-6 items-center justify-center rounded-md"
                >
                  <PenTool
                    className={cn(
                      statecategorysidebar === 'expanded'
                        ? 'text-primary'
                        : 'text-muted-foreground',
                      'hover:text-primary group-hover:text-primary size-4'
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Separator orientation="vertical" className="h-4" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleSubCategorySidebarToggle}
                  className="hover:bg-secondary group flex size-6 items-center justify-center rounded-md"
                >
                  <MessageCircle
                    className={cn(
                      'hover:text-primary group-hover:text-primary size-4',
                      statesubcategorysidebar === 'expanded'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    )}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <div
              className={cn(
                "flex h-8 items-center justify-center gap-1.5 rounded-md transition-all text-xs border text-muted-foreground hover:bg-primary-foreground hover:text-primary",
                isLoading && "cursor-not-allowed opacity-50"
              )}
            >
              {selectedProject ? (
                <div className={cn(
                  "bg-primary-foreground text-primary px-2 h-full w-full flex items-center justify-center",
                  isLoading && "cursor-not-allowed opacity-50"
                )}>
                  <FolderCogIcon className="size-3.5" />
                  {/* <span className="max-w-[100px] truncate">{selectedProject.name}</span> */}
                </div>
              ) : (
                <div className=" px-2 h-full w-full flex items-center justify-center">
                  <FolderCogIcon className="size-3.5" />
                  {/* <span>No project selected</span> */}
                </div>
              )}
              {/* <ChevronDown className="size-3 ml-0.5 mt-0.5 text-muted-foreground" /> */}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {isLoadingProjects ? (
              <div className="flex items-center justify-center py-4">
                <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : (
              <>
                {projects.length > 0 ? (
                  <>
                    <div className="px-2 pt-1 pb-2 text-xs font-medium text-muted-foreground">
                      Your projects
                    </div>
                    {projects.map((project) => (
                      <DropdownMenuItem
                        key={project.id}
                        className="flex items-center gap-2"
                        onClick={() => handleSelectProject(project)}
                      >
                        <FolderCogIcon className="size-4 text-muted-foreground" />
                        <span className="flex-1 truncate">{project.name}</span>
                        {selectedProject?.id === project.id && (
                          <Check className="size-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    ))}
                    <div className="h-px my-1 bg-border" />
                  </>
                ) : (
                  <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                    No projects found
                  </div>
                )}
                <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem
                      className="flex items-center gap-2 focus:bg-primary focus:text-primary-foreground"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <FolderPlus className="size-4" />
                      <span>Create new project</span>
                    </DropdownMenuItem>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create a new project</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
                      <Input
                        placeholder="Project name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        className="w-full"
                      />
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          disabled={isCreatingProject}
                          className="flex items-center gap-2"
                        >
                          {isCreatingProject ? (
                            <>Creating...</>
                          ) : (
                            <>
                              <Plus className="size-4" />
                              Create project
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                onClick={handleSearchToggle}
                disabled={isLoading}
                className={cn(
                  "text-muted-foreground hover:text-primary flex h-8 items-center justify-center gap-1.5 rounded-full border transition-all",
                  showSearch ? "bg-background border px-2" : "border-transparent",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: showSearch ? 180 : 0, scale: showSearch ? 1.1 : 1 }}
                  whileHover={{ rotate: showSearch ? 180 : 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <Globe
                    className={cn(
                      "hover:text-primary size-4",
                      showSearch ? "text-primary" : "text-muted-foreground",
                      isLoading && "cursor-not-allowed opacity-50"
                    )}
                  />
                </motion.div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-primary shrink-0 overflow-hidden whitespace-nowrap text-[11px]"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Smart Search with Web Access</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoading}>
            <div
              className={cn(
                "flex items-center justify-center rounded-full p-0",
                (activeCommandMode === 'image-gen' || activeCommandMode === 'search-mode' ||
                  activeCommandMode === 'thinking-mode' || activeCommandMode === 'canvas-mode') ?
                  "bg-background text-primary border" : "text-muted-foreground",
                isLoading && "cursor-not-allowed opacity-50"
              )}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <PackageOpen
                  className={cn(
                    "size-4 transition-colors",
                    (activeCommandMode === 'image-gen' || activeCommandMode === 'search-mode' ||
                      activeCommandMode === 'thinking-mode' || activeCommandMode === 'canvas-mode') ?
                      "text-primary" : "text-muted-foreground hover:text-primary"
                  )}
                />
              </motion.div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuItem onClick={handleImageSelect}>
              <Search className={cn("mr-1 size-4", activeCommandMode === 'image-gen' && "text-primary")} />
              Search
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleThinkingSelect}>
              <Lightbulb className={cn("mr-1 size-4", activeCommandMode === 'thinking-mode' && "text-primary")} />
              Thinking Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResearchSelect}>
              <CircleDotDashed className={cn("mr-1 size-4", activeCommandMode === 'research-mode' && "text-primary")} />
              Research
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleResearchSelect}>
              <Microscope className={cn("mr-1 size-4", activeCommandMode === 'research-mode' && "text-primary")} />
              Deep Research
            </DropdownMenuItem>
            {/* <DropdownMenuItem onClick={handleCanvasSelect}>
              <NotebookPen className={cn("mr-2 size-4", activeCommandMode === 'canvas-mode' && "text-primary")} />
              Canvas
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex h-full flex-row items-center gap-2.5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                type="button"
                onClick={enhancePrompt}
                disabled={isLoading}
                className={cn(
                  "text-muted-foreground hover:text-primary flex h-8 items-center justify-center gap-1.5 rounded-full border transition-all",
                  isLoading && "cursor-not-allowed opacity-50",
                  "border-transparent"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: 1 }}
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <Sparkles
                    className={cn(
                      "hover:text-primary size-4",
                      "text-muted-foreground",
                      isLoading && "cursor-not-allowed opacity-50"
                    )}
                  />
                </motion.div>
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Enhance your prompt for better AI understanding</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Dialog open={filePopoverOpen} onOpenChange={setFilePopoverOpen}>
          <DialogTrigger asChild disabled={isLoading}>
            <motion.div
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-full p-0",
                imagePreview ? "bg-background text-primary border" : "text-muted-foreground",
                isLoading && "cursor-not-allowed opacity-50"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Paperclip
                className={cn(
                  "text-muted-foreground hover:text-primary size-4 transition-colors",
                  imagePreview && "text-primary"
                )}
              />
            </motion.div>
          </DialogTrigger>
          <DialogContent
            className="bg-background/95 w-full max-w-2xl overflow-hidden border p-0 shadow-lg backdrop-blur-md"
          >
            <DialogHeader className="border-b p-4">
              <DialogTitle className="text-xl font-medium">Attach Files from MEGA</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center gap-3 border-b p-10">
              <div className="bg-primary/10 mb-3 flex size-16 items-center justify-center rounded-full">
                <Upload className="text-primary size-8" />
              </div>
              <h3 className="text-xl font-medium">Upload files to MEGA</h3>
              <p className="text-muted-foreground mb-2 text-center">
                Drag and drop files here or click to browse
              </p>

              <label>
                <Button variant="default" size="lg" className="mt-2" disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Select files"}
                  <input
                    type="file"
                    className="hidden"
                    disabled={isLoading || isUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file);
                        onImageUpload(file);
                      }
                    }}
                  />
                </Button>
              </label>
            </div>

            <div className="border-b p-4">
              <h3 className="mb-3 text-lg font-medium">Files from MEGA</h3>
              {isLoadingFiles ? (
                <div className="flex justify-center p-4">
                  <div className="border-primary size-8 animate-spin rounded-full border-b-2"></div>
                </div>
              ) : megaFiles.length > 0 ? (
                <div className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto">
                  {megaFiles.map((file) => (
                    <div
                      key={file.id}
                      className="bg-muted hover:bg-accent group relative flex cursor-pointer items-center gap-2 rounded-lg p-2 pr-8 transition-colors"
                      onClick={() => {
                        toast({
                          title: "File selected",
                          description: `${file.name} selected from MEGA`,
                        });
                        setFilePopoverOpen(false);
                      }}
                    >
                      {file.isImage ? (
                        <div className="bg-background size-8 shrink-0 overflow-hidden rounded">
                          <ImageIcon className="size-full object-cover p-1" />
                        </div>
                      ) : (
                        <File className="text-muted-foreground size-5 shrink-0" />
                      )}
                      <span className="truncate text-sm">{file.name}</span>
                      <div className="text-muted-foreground absolute right-1 top-1/2 -translate-y-1/2 text-xs">
                        {formatFileSize(file.size)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">No files found in your MEGA storage</p>
              )}
            </div>

            <div className="p-4">
              <h3 className="mb-3 text-lg font-medium">Download from URL to MEGA</h3>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter a publicly accessible URL"
                  value={attachUrl}
                  onChange={(e) => setAttachUrl(e.target.value)}
                  disabled={isUrlUploading}
                />
                <Button
                  variant="secondary"
                  onClick={handleAttachUrl}
                  disabled={isUrlUploading}
                >
                  {isUrlUploading ? "Downloading..." : "Attach"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <motion.button
          type="button"
          onClick={onSubmit}
          disabled={!value.trim()}
          className={cn(
            "bg-primary text-primary-foreground hover:text-background hover:bg-foreground flex size-8 items-center justify-center rounded-full border border-none transition-colors",
            value ? "" : "cursor-not-allowed",
            !isLoading && "p-2"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <StopCircle className="size-4" />
          ) : (
            <Radio className="size-4" />
          )}
        </motion.button>

        {/* <CategorySidebar className="!m-0 !p-0" />
        <SubCategorySidebar className="!m-0 !p-0" /> */}
      </div>
    </div>
  );
}

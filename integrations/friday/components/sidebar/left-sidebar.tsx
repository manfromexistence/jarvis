'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  AudioWaveform,
  Blocks,
  BookOpen,
  Bot,
  Calendar,
  CircleSlash2,
  Command,
  Ellipsis,
  Frame,
  GalleryVerticalEnd,
  Gift,
  Heart,
  Home,
  Info,
  LibraryBig,
  Map,
  MessageCircleQuestion,
  PanelRight,
  PieChart,
  Plus,
  Settings2,
  Sparkles,
  SquareTerminal,
  Trash2,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { History } from '@/components/sidebar/history'
import { TeamSwitcher } from '@/components/sidebar/team-switcher'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { aiService } from '@/lib/services/ai-service'
import { Banner } from '../banner'

export default function LeftSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar()
  const router = useRouter()
  const { user } = useAuth()

  // Create a handler function for the Start New button
  const handleStartNew = useCallback(async () => {
    try {
      if (!user) {
        toast.error('Authentication required', {
          description: 'Please sign in to start a new chat',
          duration: 3000,
        })
        return
      }

      // Generate a new UUID for the chat
      const chatId = uuidv4()

      // Create initial chat data with empty messages array
      const chatData = {
        id: chatId,
        title: 'New Conversation',
        messages: [], // Start with empty messages array
        model: aiService.currentModel, // Default model
        visibility: 'public',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        creatorUid: user.uid,
        reactions: {
          likes: {},
          dislikes: {},
        },
        participants: [user.uid],
        views: 0,
        uniqueViewers: [],
        isPinned: false,
      }

      // Store chat data in Firestore
      await setDoc(doc(db, 'chats', chatId), chatData)

      // Store information in sessionStorage
      sessionStorage.setItem('selectedAI', aiService.currentModel)
      sessionStorage.setItem('chatId', chatId)
      sessionStorage.setItem('isNewChat', 'true')

      // Navigate to the new chat
      router.push(`/chat/${chatId}`)
    } catch (error) {
      console.error('Error creating new chat:', error)
      toast.error('Failed to create new chat', {
        description: 'Please try again',
      })
    }
  }, [user, router])

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="w-full p-0 ">
          <div className="mb-2 flex flex-col gap-1 px-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleStartNew}
                    className="hover:text-sidebar-accent-foreground flex min-h-8 min-w-8 items-center justify-center rounded-md text-sm bg-background/40 dark:hover:bg-background hover:bg-primary-foreground hover:border-border dark:border-primary-foreground border"
                  >
                    {state === 'expanded' ? 'Start New' : <Plus className="size-4" />}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Start New Conversation</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Home className="size-4" />
                      Home
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Home</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/automations">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Sparkles className="size-4" />
                      Automations
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Automations</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/variants">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <CircleSlash2 className="size-4" />
                      Varients
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Varients</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/library">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <LibraryBig className="size-4" />
                      Library
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Library</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/projects">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Blocks className="size-4" />
                      Projects
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Projects</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/spaces">
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Frame className="size-4" />
                      Spaces
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Spaces</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={{ pathname: '/more' }}>
                    <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Ellipsis className="size-4" />
                      More
                    </SidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>More Options</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {state === 'expanded' ? (
            <div className="">
              <div className="mx-auto h-auto w-[93%] border-t border-dashed" />
              <History />
            </div>
          ) : null}
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        {state === 'expanded' ? (
          <Banner title="Info" message="Friday is still in beta so it can make mistakes." />
        ) : (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => {
                      toggleSidebar()
                    }}
                    className="hover:bg-background hover:text-sidebar-accent-foreground flex min-h-8 min-w-8 items-center justify-center rounded-md"
                  >
                    <PanelRight className="size-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand Sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="hover:bg-background hover:text-sidebar-accent-foreground flex min-h-8 min-w-8 items-center justify-center rounded-md">
                    <Info className="size-[18.5px]" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Friday is still in beta so it can make mistakes.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        {/* <NavUser /> */}
      </SidebarFooter>
    </Sidebar>
  )
}

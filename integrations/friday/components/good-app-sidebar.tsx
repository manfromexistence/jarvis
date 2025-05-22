'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  Blocks,
  CircleSlash2,
  Frame,
  Home,
  LibraryBig,
  Sparkles,
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  GoodSidebar,
  GoodSidebarContent,
  GoodSidebarFooter,
  GoodSidebarHeader,
  GoodSidebarMenuButton,
  useGoodSidebar,
} from '@/components/good-sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { History } from '@/components/sidebar/history'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import { aiService } from '@/lib/services/ai-service'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  children: React.ReactNode
}

export function TeamSwitcher() {
  const { toggleSidebar, state } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="peer/menu-button ring-sidebar-ring data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground flex h-8 w-full items-center gap-2 rounded-md p-2 !px-0 text-left text-sm outline-none transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:font-medium group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-0 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
          Category Sidebar
          {/* <PanelRight
            onClick={() => {
              toggleSidebar()
            }}
            className="ml-auto"
          />
          {state === 'expanded' ? (
            <PanelRight
              onClick={() => {
                toggleSidebar()
              }}
              className="ml-auto"
            />
          ) : null} */}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default function GoodSidebarApp({ ...props }: React.ComponentProps<typeof GoodSidebar>) {
  const { state, toggleGoodSidebar } = useGoodSidebar()
  const router = useRouter()

  return (
    <GoodSidebar side="right" {...props}>
      <GoodSidebarHeader>
        <TeamSwitcher />
      </GoodSidebarHeader>
      <GoodSidebarContent>
        <ScrollArea className="w-full p-0 ">
          <div className="mb-2 flex flex-col gap-1 px-2">
            <TooltipProvider>
              {/* <Tooltip>
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
              </Tooltip> */}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Home className="size-4" />
                      Text
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Text</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/automations">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Sparkles className="size-4" />
                      Image
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Image</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/variants">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <CircleSlash2 className="size-4" />
                      Audio
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Audio</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/library">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <LibraryBig className="size-4" />
                      Video
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Video</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/projects">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Blocks className="size-4" />
                      3d
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>3d</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/spaces">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Frame className="size-4" />
                      Ar
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Ar</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/spaces">
                    <GoodSidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground dark:hover:bg-background/40 dark:hover:text-sidebar-accent-foreground hover:bg-primary-foreground hover:text-primary group flex flex-row items-center justify-start transition-all duration-200 ease-in-out border border-transparent hover:border-background">
                      <Frame className="size-4" />
                      Vr
                    </GoodSidebarMenuButton>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Vr</p>
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
      </GoodSidebarContent>
      {/* <GoodSidebarFooter>
        {state === 'expanded' ? null : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() => {
                    toggleGoodSidebar()
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
        )}
        <NavUser />
      </GoodSidebarFooter> */}
    </GoodSidebar>
  )
}

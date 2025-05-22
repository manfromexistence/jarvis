'use client'

import { useState } from 'react'
import {
  Settings,
  CreditCard,
  FileText,
  Users,
  LogOut,
  Moon,
  Sun,
  Laptop,
  User,
  Settings2,
  Cog,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import * as React from 'react'
import { useCategorySidebar } from '@/components/category-sidebar'
import { useSubCategorySidebar } from '@/components/subcategory-sidebar'
import { usePathname } from 'next/navigation'
import {
  User as FirebaseUser,
  getAuth,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSidebar } from '@/components/ui/sidebar'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { createAnimation } from '@/components/ui/theme-animations'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGoodSidebar } from './good-sidebar'
import { useTheme } from 'next-themes'

export default function Profile() {
  const [open, setOpen] = useState(false)
  const [language, setLanguage] = useState('English')
  const pathname = usePathname()
  const { toggleGoodSidebar, state } = useGoodSidebar()
  const { statecategorysidebar, toggleCategorySidebar } = useCategorySidebar()
  const { statesubcategorysidebar, toggleSubCategorySidebar } = useSubCategorySidebar()
  const { user } = useAuth()
  const { isMobile, state: leftSidebarState } = useSidebar()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const params = useParams()
  const queryClient = useQueryClient()
  const [isChangingVisibility, setIsChangingVisibility] = useState(false)
  const { theme, setTheme } = useTheme()
  const styleId = 'theme-transition-styles'
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setCommandOpen(false)
    command()
  }, [])

  const updateStyles = React.useCallback((css: string, name: string) => {
    if (typeof window === 'undefined') return

    let styleElement = document.getElementById(styleId) as HTMLStyleElement

    console.log('style ELement', styleElement)
    console.log('name', name)

    if (!styleElement) {
      styleElement = document.createElement('style')
      styleElement.id = styleId
      document.head.appendChild(styleElement)
    }

    styleElement.textContent = css

    console.log('content updated')
  }, [])

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(
      'gif',
      'center',
      'https://media.giphy.com/media/5PncuvcXbBuIZcSiQo/giphy.gif?cid=ecf05e47j7vdjtytp3fu84rslaivdun4zvfhej6wlvl6qqsz&ep=v1_stickers_search&rid=giphy.gif&ct=s'
    )

    updateStyles(animation.css, animation.name)

    if (typeof window === 'undefined') return

    const switchTheme = () => {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }

    if (!document.startViewTransition) {
      switchTheme()
      return
    }

    document.startViewTransition(switchTheme)
  }, [theme, setTheme, updateStyles])

  // Firebase user data
  const userImage = (user as FirebaseUser)?.photoURL
  const userName = (user as FirebaseUser)?.displayName
  const userEmail = (user as FirebaseUser)?.email
  const fallbackInitial = userName?.[0] || userEmail?.[0]?.toUpperCase() || 'U'

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut(getAuth())
      router.push('/') // Redirect to home page
      toast.success('Successfully logged out')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to log out. Please try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleLogin = async () => {
    try {
      setIsLoggingIn(true)
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
      toast.success('Successfully logged in')
    } catch (error) {
      console.error('Error signing in:', error)
      toast.error('Failed to log in. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="rounded-md hover:bg-primary-foreground p-0.5">
          <Avatar className="size-7 cursor-pointer rounded-full">
            <AvatarImage src={userImage ?? undefined} alt={userName || 'User'} />
            <AvatarFallback className="rounded-full">{fallbackInitial}</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="end">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 py-1.5 text-left text-sm border-b hover:bg-primary-foreground px-3">
            <Avatar className="size-8 rounded-md">
              <AvatarImage src={userImage ?? undefined} alt={userName || 'User'} />
              <AvatarFallback className="rounded-md">{fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-sm font-semibold">{userName}</span>
              <span className="truncate text-xs">{userEmail}</span>
            </div>
          </div>

          {/* <div className="space-y-1 p-3 border-b hover:bg-primary-foreground">
            <div className="flex justify-between items-center">
              <span className="text-sm">Messages Left</span>
              <span className="text-sm">9/10</span>
            </div>
            <p className="text-xs">Usage resets in 1 day</p>
          </div> */}

          <nav className="p-1">
            <Button variant="ghost" className="w-full justify-start px-2 py-2 h-9 text-sm">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-2 h-9 text-sm">
              <CreditCard className="h-4 w-4" />
              Pricing
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-2 h-9 text-sm">
              <FileText className="h-4 w-4" />
              Documentation
            </Button>
            <Button variant="ghost" className="w-full justify-start px-2 py-2 h-9 text-sm">
              <Users className="h-4 w-4" />
              Community
            </Button>
          </nav>

          <div className="p-3 border-t">
            <p className="text-sm mb-3">Preferences</p>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Theme</span>
                <div className="flex space-x-1 p-1 border rounded-full">
                  <button
                    onClick={() => toggleTheme()}
                    className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-primary-foreground border' : ''}`}
                  >
                    <Sun className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleTheme()}
                    className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-primary-foreground border' : ''}`}
                  >
                    <Moon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleTheme()}
                    className={`p-1.5 rounded-full ${theme === 'system' ? 'bg-primary-foreground border' : ''}`}
                  >
                    <Cog className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Language Selector */}
              <div className="flex justify-between items-center">
                <span className="text-sm">Language</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 px-2 text-sm bg-transparent border">
                      {language}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-2 h-4 w-4"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="">
                    <DropdownMenuItem onClick={() => setLanguage('English')}>
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('Spanish')}>
                      Spanish
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('French')}>
                      French
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage('German')}>
                      German
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          {/* <Button variant="ghost" className="justify-start px-2 py-2 h-9 text-sm rounded-none border-t">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
    
              <div className="p-4 border-t ">
                <Button className="w-full">Upgrade to Premium</Button>
              </div> */}
        </div>
      </PopoverContent>
    </Popover>
  )
}

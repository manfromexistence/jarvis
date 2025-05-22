'use client'
import { SubCategorySidebarProvider } from '@/components/subcategory-sidebar'
import { CategorySidebarProvider } from '@/components/category-sidebar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster as NewYorkSonner } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/providers/providers'
import { FirebaseProvider } from '@/contexts/firebase-context'
import LeftSidebar from '@/components/sidebar/left-sidebar'
import { ThemeSwitcher } from '@/components/theme-switcher'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthProvider } from '@/contexts/auth-context'
import { SiteHeader } from '@/components/site-header'
import { BottomBar } from '@/components/bottom-bar'
import { Main } from '@/components/providers/main'
import { Analytics } from '@/components/analytics'
import '@/lib/store/ai-model-store'
import { Toaster as DefaultToaster, Toaster as NewYorkToaster } from '@/components/ui/toaster'
import { CodeSidebarProvider } from '@/app/dashboard/sidebar'
import { GoodSidebarProvider } from '../good-sidebar'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

interface RootProviderProps {
  children: React.ReactNode
}

export function RootProvider({ children }: RootProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <FirebaseProvider>
          <AuthProvider>
            <SidebarProvider>
              <LeftSidebar />
              <GoodSidebarProvider>
                <CategorySidebarProvider>
                  <SubCategorySidebarProvider>
                    <CodeSidebarProvider>
                      <div
                        vaul-drawer-wrapper=""
                        className="relative h-screen w-full overflow-hidden"
                      >
                        <SiteHeader />
                        <Main>{children}</Main>
                        <NewYorkToaster />
                        <DefaultToaster />
                        <NewYorkSonner />
                        <Analytics />
                        <ThemeSwitcher />
                      </div>
                    </CodeSidebarProvider>
                  </SubCategorySidebarProvider>
                </CategorySidebarProvider>
              </GoodSidebarProvider>
            </SidebarProvider>
          </AuthProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

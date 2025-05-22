
        {/* <div className="xs:flex hover:bg-primary-foreground hidden h-8 items-center justify-center gap-1 rounded-md border px-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleGoodSidebarToggle}
                  className="hover:bg-secondary group flex size-6 items-center justify-center rounded-md"
                >
                  <MessageCircle
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
                <p>Good sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={handleCategorySidebarToggle}
                  className="hover:bg-secondary group flex size-6 items-center justify-center rounded-md"
                >
                  <MessageCircle
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
                <p>Category Sidebar</p>
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
                  <Type
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
                <p>Subcategory Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div> */}

{
  /* <DropdownMenu>
<DropdownMenuTrigger asChild>
  <Avatar className="!ml-1 size-8 cursor-pointer rounded-lg">
    <AvatarImage src={userImage ?? undefined} alt={userName || 'User'} />
    <AvatarFallback className="rounded-lg">{fallbackInitial}</AvatarFallback>
  </Avatar>
</DropdownMenuTrigger>
<DropdownMenuContent
  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
  side={isMobile ? 'bottom' : 'right'}
>
  <DropdownMenuLabel className="p-0 font-normal">
    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="size-8 rounded-lg">
        <AvatarImage src={userImage ?? undefined} alt={userName || 'User'} />
        <AvatarFallback className="rounded-lg">{fallbackInitial}</AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate text-sm font-semibold">{userName}</span>
        <span className="truncate text-xs">{userEmail}</span>
      </div>
    </div>
  </DropdownMenuLabel>
  <DropdownMenuSeparator />
  <DropdownMenuGroup>
    <DropdownMenuItem>
      <Sparkles className="mr-2 size-4" />
      Upgrade to Pro
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuGroup>
    <DropdownMenuItem>
      <BadgeCheck className="mr-2 size-4" />
      Account
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard className="mr-2 size-4" />
      Billing
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Bell className="mr-2 size-4" />
      Notifications
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem onClick={toggleTheme}>
    {theme === 'light' ? (
      <MoonIcon className="mr-2 size-4" />
    ) : (
      <SunIcon className="mr-2 size-4" />
    )}
    {theme === 'light' ? 'Dark' : 'Light'} Mode
  </DropdownMenuItem>
  <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
    <LogOut className="mr-2 size-4" />
    {isLoggingOut ? 'Logging out...' : 'Log out'}
  </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu> */
}

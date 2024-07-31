'use client'
import Image from "next/image"
import Link from "next/link"
import { Clock, Home, LineChart, Package, PanelLeft, Search, Settings, ShoppingCart, Users2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

export function Navbar() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // console.log('Cookies', document.cookie);
    const token = Cookies.get('token')
    const role = Cookies.get('role') || null
    // console.log(role);
    if (token) {
      setIsAuth(true)
      setUserRole(role)
    } else {
      setIsAuth(false)
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded && !isAuth) {
      router.push('/')
    }
  }, [isLoaded, isAuth, router])

  const handleLogout = () => {
    Cookies.remove('token')
    Cookies.remove('role')
    setIsAuth(false)
    router.push('/')
  }

  if (!isLoaded || !isAuth) return null // Avoid rendering until the auth status is confirmed

  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* {userRole === 'cashier' && ( */}
          <>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/orders" className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Orders</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Orders</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href="/shift" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                    <Clock className="h-5 w-5" />
                    <span className="sr-only">Shift</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Shift</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            </>
          {/* )} */}

          {/* {userRole === 'admin' && ( */}
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/productManagements" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                      <Package className="h-5 w-5" />
                      <span className="sr-only">Products Management</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Products Management</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/admin/cashierManagements" className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
                      <Users2 className="h-5 w-5" />
                      <span className="sr-only">Cashier Management</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Cashier Management</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          {/* )} */}

        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link href="#" className="flex items-center gap-4 px-2.5 text-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                {/* Conditionally render sidebar items based on role */}
                {/* {userRole === 'admin' && ( */}
                  <>
                    <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <Package className="h-5 w-5" />
                      Products
                    </Link>
                    <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                      <Users2 className="h-5 w-5" />
                      Customers
                    </Link>
                  </>
                {/* )} */}
                {/* {userRole === 'cashier' && ( */}
                  <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                    <Clock className="h-5 w-5" />
                    Shift
                  </Link>
                {/* )} */}
                <Link href="#" className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground">
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full">
                <Image src="/images/photo.jpeg" width={36} height={36} alt="Avatar" className="overflow-hidden rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </div>
  )
}

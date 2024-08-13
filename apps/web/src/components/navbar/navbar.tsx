'use client';
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  BookKey,
  Clock,
  Home,
  Package,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteToken } from '@/app/action';

export function Navbar() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchUserRole = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}account/get-role`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await response.json();
      setRole(data.role);
    };
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    fetchUserRole();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && !isAuth) {
      router.push('/');
    }
  }, [isLoaded, isAuth, router]);

  const handleLogout = () => {
    Cookies.remove('token');
    deleteToken('token');

    setIsAuth(false);
    router.push('/');
    window.location.reload();
  };
  if (!isLoaded || !isAuth) return null;

  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {role == 'cashier' ? (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/orders"
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
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
                    <Link
                      href="/activity"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Clock className="h-5 w-5" />
                      <span className="sr-only">Activity</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Activity</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          ) : (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin/productManagements"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Package className="h-5 w-5" />
                      <span className="sr-only">Products Management</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Products Management
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin/cashierManagements"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Users2 className="h-5 w-5" />
                      <span className="sr-only">Cashier Management</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    Cashier Management
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin/recentShift"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <BookKey className="h-5 w-5" />
                      <span className="sr-only">Recent Shift</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Recent Shift</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </>
          )}
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
                <Link
                  href="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/orders"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Point Of Sales
                </Link>
                <Link
                  href="/admin/productManagements"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products Managements
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>

                <Link
                  href="/activity"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Clock className="h-5 w-5" />
                  Activity
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
                className="overflow-hidden rounded-full"
              >
                <Image
                  src="/images/photo.jpeg"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
    </div>
  );
}

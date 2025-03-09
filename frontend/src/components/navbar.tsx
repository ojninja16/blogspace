"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/lib/auth-context";
import { BookOpen, LogOut, Menu, PenSquare, User, X } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const routes = [
    { href: "/", label: "Home", icon: BookOpen },
    ...(user
      ? [{ href: "/dashboard", label: "Dashboard", icon: PenSquare }]
      : [
          { href: "/login", label: "Login", icon: User },
          { href: "/signup", label: "Sign Up", icon: User },
        ]),
  ];

  const initials = user?.email
    ? user.email.split("@")[0].substring(0, 2).toUpperCase()
    : "GU";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="ml-4 flex items-center gap-2 md:gap-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link
                  href="/"
                  className="flex items-center font-bold"
                  onClick={() => setOpen(false)}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  BlogSpace
                </Link>
              </div>
              <nav className="flex flex-col gap-3 px-2 pt-8 ">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center px-4 py-2 text-sm font-medium ${
                      pathname === route.href
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground/60 hover:text-foreground"
                    } rounded-md transition-colors`}
                  >
                    <route.icon className="mr-2 h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
                {user && (
                  <Button
                    variant="ghost"
                    className="justify-start px-4 text-sm font-medium text-foreground/60 hover:text-foreground"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center space-x-2 font-bold">
            <BookOpen className="h-5 w-5" />
            <span>BlogSpace</span>
          </Link>

          <nav className="hidden md:flex gap-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`flex items-center text-sm font-medium ${
                  pathname === route.href
                    ? "text-foreground"
                    : "text-foreground/60 hover:text-foreground"
                } transition-colors`}
              >
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hidden md:flex"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

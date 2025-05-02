'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, LayoutDashboardIcon } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/ideas" className="flex items-center space-x-2">
            <LightbulbIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Actionable</span>
          </Link>
        </div>
        
        <nav className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/ideas"
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/ideas") 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LightbulbIcon className="h-4 w-4" />
              <span>アイデア</span>
            </Link>
            <Link 
              href="/projects"
              className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors ${
                isActive("/projects") 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutDashboardIcon className="h-4 w-4" />
              <span>マイページ</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
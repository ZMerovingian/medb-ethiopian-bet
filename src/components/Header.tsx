
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Session } from "@supabase/supabase-js";
import { User, LogOut, settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";

interface HeaderProps {
  session: Session | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

const Header = ({ session, onAuthClick, onSignOut }: HeaderProps) => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-yellow-500">{t('siteName')}</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-slate-300 hover:text-yellow-500 transition-colors">
                {t('home')}
              </a>
              <a href="#games" className="text-slate-300 hover:text-yellow-500 transition-colors">
                {t('games')}
              </a>
              <a href="#sports" className="text-slate-300 hover:text-yellow-500 transition-colors">
                {t('sports')}
              </a>
              <a href="#live" className="text-slate-300 hover:text-yellow-500 transition-colors">
                {t('live')}
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-yellow-500 text-slate-900">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{session.user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    onClick={() => window.location.href = '/account'}
                  >
                    <settings className="mr-2 h-4 w-4" />
                    {t('accountSettings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem 
                    className="text-slate-300 hover:text-white hover:bg-slate-700 cursor-pointer"
                    onClick={onSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('logOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={onAuthClick}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {t('signIn')}
                </Button>
                <Button
                  onClick={() => window.location.href = '/auth'}
                  className="bg-yellow-500 text-slate-900 hover:bg-yellow-600"
                >
                  {t('getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

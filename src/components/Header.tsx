
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogIn, LogOut, Menu, X, User } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface HeaderProps {
  session: Session | null;
  onAuthClick: () => void;
  onSignOut: () => void;
}

const Header = ({ session, onAuthClick, onSignOut }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-yellow-400">
              MEDB
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#games" className="text-slate-300 hover:text-yellow-400 transition-colors">
              Games
            </a>
            <a href="#sports" className="text-slate-300 hover:text-yellow-400 transition-colors">
              Sports
            </a>
            <a href="#live" className="text-slate-300 hover:text-yellow-400 transition-colors">
              Live
            </a>
          </nav>

          {/* User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-300 text-sm">
                    Welcome back!
                  </span>
                </div>
                <Button
                  onClick={onSignOut}
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a 
                  href="/auth"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  Sign In
                </a>
                <Button
                  onClick={() => window.location.href = '/auth'}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <nav className="flex flex-col space-y-4">
              <a 
                href="#games" 
                className="text-slate-300 hover:text-yellow-400 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Games
              </a>
              <a 
                href="#sports" 
                className="text-slate-300 hover:text-yellow-400 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sports
              </a>
              <a 
                href="#live" 
                className="text-slate-300 hover:text-yellow-400 transition-colors px-4 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Live
              </a>
              
              <div className="px-4 pt-4 border-t border-slate-800">
                {session ? (
                  <div className="space-y-3">
                    <div className="text-slate-300 text-sm">Welcome back!</div>
                    <Button
                      onClick={onSignOut}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        window.location.href = '/auth';
                        setIsMenuOpen(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        window.location.href = '/auth';
                        setIsMenuOpen(false);
                      }}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X, User, Wallet, Settings, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { LanguageSelector } from "./LanguageSelector";

interface HeaderProps {
  session: Session | null;
  onAuthClick: () => void;
}

const Header = ({ session, onAuthClick }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    }
  };

  return (
    <header className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-slate-900 font-bold text-lg">M</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              MEDB
            </span>
            <Badge variant="secondary" className="bg-red-600 text-white text-xs">
              ETH
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#games" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
              Casino
            </a>
            <a href="#sports" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
              Sports
            </a>
            <a href="#live" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
              Live
            </a>
            <a href="#promotions" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
              Promotions
            </a>
          </nav>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">0.00 ETB</span>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <Wallet className="w-4 h-4 mr-2" />
                      Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-slate-300 hover:text-white hover:bg-slate-700">
                      <Link to="/account">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={handleSignOut}
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                onClick={onAuthClick}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-slate-900 font-semibold"
              >
                Sign In
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-800 mt-4">
            <nav className="flex flex-col space-y-4 pt-4">
              <a href="#games" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Casino
              </a>
              <a href="#sports" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Sports
              </a>
              <a href="#live" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Live
              </a>
              <a href="#promotions" className="text-slate-300 hover:text-yellow-400 transition-colors font-medium">
                Promotions
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

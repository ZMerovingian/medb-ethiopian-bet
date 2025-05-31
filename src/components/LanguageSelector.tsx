
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'አማ'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        <DropdownMenuItem 
          onClick={() => setLanguage('en')}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setLanguage('am')}
          className="text-slate-300 hover:text-white hover:bg-slate-700"
        >
          አማርኛ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

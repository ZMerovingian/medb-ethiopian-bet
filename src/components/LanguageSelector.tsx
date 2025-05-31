
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { languages } from "lucide-react";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={(value: 'en' | 'am') => setLanguage(value)}>
      <SelectTrigger className="w-20 bg-slate-800 border-slate-600 text-slate-300">
        <languages className="w-4 h-4" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-slate-700">
        <SelectItem value="en" className="text-slate-300 hover:bg-slate-700">
          EN
        </SelectItem>
        <SelectItem value="am" className="text-slate-300 hover:bg-slate-700">
          አማ
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelector;

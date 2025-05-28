
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Shield,
  Award,
  Clock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
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
            <p className="text-slate-400 text-sm leading-relaxed">
              Ethiopia's premier online betting platform offering provably fair casino games, 
              live sports betting, and secure payment solutions.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-yellow-400">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-yellow-400">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-yellow-400">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-yellow-400">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Casino Games', 'Sports Betting', 'Live Streams', 'Promotions', 'VIP Program', 'Affiliate Program'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-yellow-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {['Help Center', 'Contact Us', 'Payment Methods', 'Responsible Gaming', 'Terms & Conditions', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-slate-400 hover:text-yellow-400 text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-400 mt-1 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Addis Ababa, Ethiopia<br />
                  Bole Sub-City
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+251 11 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">support@medb.bet</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span className="text-slate-400 text-sm">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-800 my-8" />

        {/* Security & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold mb-1">Secure & Licensed</h4>
            <p className="text-slate-400 text-xs">SSL Encrypted & Regulated</p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold mb-1">Provably Fair</h4>
            <p className="text-slate-400 text-xs">Cryptographically Verified</p>
          </div>
          <div className="text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <h4 className="text-white font-semibold mb-1">24/7 Support</h4>
            <p className="text-slate-400 text-xs">Always Here to Help</p>
          </div>
        </div>

        <Separator className="bg-slate-800 my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-slate-400 text-sm">
            © 2024 MEDB. All rights reserved. | Age 18+ | Play Responsibly
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-slate-800 text-slate-300 border-slate-700">
              🇪🇹 Made in Ethiopia
            </Badge>
            <Badge className="bg-green-800 text-green-300 border-green-700">
              🔒 Secure Platform
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

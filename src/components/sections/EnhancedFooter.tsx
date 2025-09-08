import { Mail, Phone, MapPin } from "lucide-react";

export const EnhancedFooter = () => {
  const productLinks = [
    { title: "Features", href: "#features" },
    { title: "Templates", href: "#templates" },
    { title: "Pricing", href: "#pricing" },
    { title: "Demo", href: "#demo" }
  ];

  const companyLinks = [
    { title: "About Us", href: "#about" },
    { title: "Blog", href: "#blog" },
    { title: "Careers", href: "#careers" },
    { title: "Press", href: "#press" }
  ];

  const supportLinks = [
    { title: "Help Center", href: "#help" },
    { title: "Contact", href: "#contact" },
    { title: "API Docs", href: "#api" },
    { title: "Status", href: "#status" }
  ];

  const legalLinks = [
    { title: "Privacy Policy", href: "#privacy" },
    { title: "Terms of Service", href: "#terms" },
    { title: "Cookie Policy", href: "#cookie" },
    { title: "GDPR", href: "#gdpr" }
  ];

  const socialLinks = [
    { title: "Twitter", href: "#twitter" },
    { title: "Facebook", href: "#facebook" },
    { title: "Instagram", href: "#instagram" },
    { title: "LinkedIn", href: "#linkedin" }
  ];

  return (
    <footer className="bg-foreground text-background section-padding">
      <div className="container-fluid">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold">Menius</span>
            </div>
            <p className="text-background/80 mb-6 max-w-md leading-relaxed">
              Empowering restaurants to create beautiful digital menus that enhance customer experience and boost revenue. Join thousands of satisfied restaurant owners.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-background/60" />
                <span className="text-background/80">hello@menius.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-background/60" />
                <span className="text-background/80">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-background/60" />
                <span className="text-background/80">San Francisco, CA</span>
              </div>
            </div>
          </div>
          
          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-background/80">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-background transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-background/80">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-background transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-background/80">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-background transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-background/80">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="hover:text-background transition-colors text-sm">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2024 Menius. All rights reserved.
            </p>
            <div className="flex gap-6 text-background/60">
              <span className="text-sm">Follow us for updates</span>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index}
                    href={social.href} 
                    className="hover:text-background transition-colors text-sm"
                  >
                    {social.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
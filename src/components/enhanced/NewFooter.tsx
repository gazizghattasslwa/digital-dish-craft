import { Mail, Phone, MapPin } from "lucide-react";

export const NewFooter = () => {
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
    { title: "Cookie Policy", href: "#cookies" },
    { title: "GDPR", href: "#gdpr" }
  ];

  const socialLinks = [
    { title: "Twitter", href: "#twitter" },
    { title: "Facebook", href: "#facebook" },
    { title: "Instagram", href: "#instagram" },
    { title: "LinkedIn", href: "#linkedin" }
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="text-2xl font-bold mb-4">Menura</div>
            <p className="text-background/70 mb-6 leading-relaxed">
              Empowering restaurants to create beautiful digital menus that enhance customer experience and boost revenue. Join thousands of satisfied restaurant owners.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>hello@menura.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-background/70 hover:text-background transition-colors">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-background/70 text-sm mb-4 md:mb-0">
            © 2024 Menura. All rights reserved.
          </p>
          <div className="flex space-x-6">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href} 
                className="text-background/70 hover:text-background transition-colors text-sm"
              >
                {link.title}
              </a>
            ))}
            <span className="text-background/50 text-sm">Follow us for updates</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
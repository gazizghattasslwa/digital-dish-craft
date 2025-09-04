import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { EnhancedHeroSection } from "@/components/enhanced/EnhancedHeroSection";
import { FeaturesSection } from "@/components/enhanced/FeaturesSection";
import { HowItWorksSection } from "@/components/enhanced/HowItWorksSection";
import { DashboardSamples } from "@/components/enhanced/DashboardSamples";
import { PricingSection } from "@/components/enhanced/PricingSection";
import { SEOContent } from "@/components/enhanced/SEOContent";
import { MenuBuilder, MenuItem } from "@/components/MenuBuilder";
import { MenuPreview } from "@/components/MenuPreview";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, QrCode } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const [showBuilder, setShowBuilder] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [colors, setColors] = useState({
    primary: "#ea580c",
    secondary: "#15803d"
  });

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      window.location.href = '/dashboard';
    }
  }, [user]);

  if (!showBuilder) {
    return (
      <>
        <Helmet>
          <title>MenuCraft - Digital Restaurant Menu Builder | Create QR Code Menus</title>
          <meta name="description" content="Create professional digital restaurant menus in minutes. Generate QR codes, enable instant updates, and provide mobile-optimized dining experiences. Free to start!" />
          <meta name="keywords" content="digital menu, restaurant menu, QR code menu, mobile menu, contactless menu, menu builder, restaurant technology" />
          <meta property="og:title" content="MenuCraft - Transform Your Restaurant Menu Into a Digital Experience" />
          <meta property="og:description" content="Create stunning, mobile-optimized digital menus with QR codes, instant updates, and custom branding. Trusted by 1000+ restaurants worldwide." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="MenuCraft - Digital Restaurant Menu Builder" />
          <meta name="twitter:description" content="Transform your restaurant menu into a digital experience. Mobile-optimized, QR codes, instant updates. Free to start!" />
          <link rel="canonical" href="https://menucraft.com" />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "MenuCraft",
              "description": "Digital restaurant menu builder with QR codes and mobile optimization",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "1000"
              }
            })}
          </script>
        </Helmet>
        
        <div className="min-h-screen bg-gradient-surface">
          <EnhancedHeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <DashboardSamples />
          <PricingSection />
          <SEOContent />
          
          {/* Footer */}
          <footer className="bg-foreground text-background section-padding">
            <div className="container-fluid">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">M</span>
                    </div>
                    <span className="text-2xl font-bold">MenuCraft</span>
                  </div>
                  <p className="text-background/80 mb-6 max-w-md leading-relaxed">
                    Transform your restaurant menu into a digital experience. 
                    Mobile-optimized, QR codes, instant updates, and custom branding.
                  </p>
                </div>
                
                <div className="col-span-1 md:col-span-1">
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2 text-background/80">
                    <li><a href="#features" className="hover:text-background transition-colors">Features</a></li>
                    <li><a href="#how-it-works" className="hover:text-background transition-colors">How It Works</a></li>
                    <li><a href="#pricing" className="hover:text-background transition-colors">Pricing</a></li>
                    <li><a href="#examples" className="hover:text-background transition-colors">Examples</a></li>
                  </ul>
                </div>
                
                <div className="col-span-1 md:col-span-1">
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-background/80">
                    <li><a href="#help" className="hover:text-background transition-colors">Help Center</a></li>
                    <li><a href="#contact" className="hover:text-background transition-colors">Contact</a></li>
                    <li><a href="#privacy" className="hover:text-background transition-colors">Privacy</a></li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-background/20 mt-12 pt-8 text-center text-background/60">
                <p>&copy; 2024 MenuCraft. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Menu Builder - Create Your Digital Menu | MenuCraft</title>
        <meta name="description" content="Interactive menu builder demo. Create, customize, and preview your digital restaurant menu with real-time updates and QR code generation." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-surface">
        {/* Enhanced Header */}
        <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40 shadow-soft">
          <div className="container-fluid py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gradient">
                    Menu Builder
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {restaurantName || "Your Restaurant"} Menu
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowBuilder(false)} className="hover-lift">
                  Back to Home
                </Button>
                <Button className="btn-primary hover-lift">
                  Publish Menu
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container-fluid py-8">
          <Tabs defaultValue="build" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm shadow-soft">
              <TabsTrigger value="build" className="transition-spring">Build Menu</TabsTrigger>
              <TabsTrigger value="customize" className="transition-spring">Customize</TabsTrigger>
              <TabsTrigger value="preview" className="transition-spring">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="build" className="space-y-6">
              <MenuBuilder 
                menuItems={menuItems}
                onMenuItemsChange={setMenuItems}
              />
            </TabsContent>
            
            <TabsContent value="customize" className="space-y-6">
              <CustomizationPanel
                restaurantName={restaurantName}
                onRestaurantNameChange={setRestaurantName}
                colors={colors}
                onColorsChange={setColors}
              />
            </TabsContent>
            
            <TabsContent value="preview" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-foreground">Menu Preview</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  This is how your customers will see your menu. Make sure everything looks perfect!
                </p>
              </div>
              <MenuPreview 
                menuItems={menuItems}
                restaurantName={restaurantName}
                colors={colors}
              />
              
              {menuItems.length > 0 && (
                <Card className="shadow-warm hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Share Your Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg backdrop-blur-sm">
                      <p className="text-sm text-muted-foreground mb-2">Menu Link:</p>
                      <code className="text-primary font-mono text-sm break-all">
                        https://menucraft.com/{restaurantName.toLowerCase().replace(/\s+/g, '-') || 'restaurant'}
                      </code>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 btn-primary hover-lift">
                        <QrCode className="w-4 h-4 mr-2" />
                        Generate QR Code
                      </Button>
                      <Button variant="outline" className="flex-1 hover-lift">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Copy Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Index;

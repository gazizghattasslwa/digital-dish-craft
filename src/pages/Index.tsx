import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { NewHeroSection } from "@/components/enhanced/NewHeroSection";
import { NewFeaturesSection } from "@/components/enhanced/NewFeaturesSection";
import { HowItWorksSection } from "@/components/enhanced/HowItWorksSection";
import { DashboardSamples } from "@/components/enhanced/DashboardSamples";
import { NewPricingSection } from "@/components/enhanced/NewPricingSection";
import { SEOContent } from "@/components/enhanced/SEOContent";
import { NewTransformSection } from "@/components/enhanced/NewTransformSection";
import { NewSmartChoiceSection } from "@/components/enhanced/NewSmartChoiceSection";
import { NewFAQSection } from "@/components/enhanced/NewFAQSection";
import { NewFooter } from "@/components/enhanced/NewFooter";
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
          <title>Menura - Digital Restaurant Menu Builder | Create QR Code Menus</title>
          <meta name="description" content="Create professional digital restaurant menus in minutes. Generate QR codes, enable instant updates, and provide mobile-optimized dining experiences. Free to start!" />
          <meta name="keywords" content="digital menu, restaurant menu, QR code menu, mobile menu, contactless menu, menu builder, restaurant technology" />
          <meta property="og:title" content="Menura - Transform Your Restaurant Menu Into a Digital Experience" />
          <meta property="og:description" content="Create stunning, mobile-optimized digital menus with QR codes, instant updates, and custom branding. Trusted by 1000+ restaurants worldwide." />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Menura - Digital Restaurant Menu Builder" />
          <meta name="twitter:description" content="Transform your restaurant menu into a digital experience. Mobile-optimized, QR codes, instant updates. Free to start!" />
          <link rel="canonical" href="https://menura.com" />
          
          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Menura",
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
        
        <div className="min-h-screen bg-background">
          <NewHeroSection />
          <NewFeaturesSection />
          <HowItWorksSection />
          <NewSmartChoiceSection />
          <DashboardSamples />
          <NewPricingSection />
          <NewTransformSection />
          <NewFAQSection />
          <SEOContent />
          <NewFooter />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Menu Builder - Create Your Digital Menu | Menura</title>
        <meta name="description" content="Interactive menu builder demo. Create, customize, and preview your digital restaurant menu with real-time updates and QR code generation." />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        {/* Enhanced Header */}
        <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-40">
          <div className="container-fluid py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    Menu Builder
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {restaurantName || "Your Restaurant"} Menu
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowBuilder(false)}>
                  Back to Home
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Publish Menu
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container-fluid py-8">
          <Tabs defaultValue="build" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
              <TabsTrigger value="build">Build Menu</TabsTrigger>
              <TabsTrigger value="customize">Customize</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
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
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5" />
                      Share Your Menu
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-2">Menu Link:</p>
                      <code className="text-primary font-mono text-sm break-all">
                        https://menura.com/{restaurantName.toLowerCase().replace(/\s+/g, '-') || 'restaurant'}
                      </code>
                    </div>
                    <div className="flex gap-3">
                      <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        <QrCode className="w-4 h-4 mr-2" />
                        Generate QR Code
                      </Button>
                      <Button variant="outline" className="flex-1 border-border">
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

import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { MenuBuilder, MenuItem } from "@/components/MenuBuilder";
import { MenuPreview } from "@/components/MenuPreview";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, QrCode, Smartphone, Palette } from "lucide-react";

const Index = () => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [colors, setColors] = useState({
    primary: "#ea580c",
    secondary: "#15803d"
  });

  if (!showBuilder) {
    return (
      <div className="min-h-screen bg-background">
        <HeroSection />
        
        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Everything You Need to Go Digital
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From menu creation to customer engagement, we've got your restaurant covered
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <Smartphone className="w-8 h-8" />,
                  title: "Mobile First",
                  description: "Optimized for smartphones and tablets"
                },
                {
                  icon: <QrCode className="w-8 h-8" />,
                  title: "QR Codes",
                  description: "Instant access with QR code generation"
                },
                {
                  icon: <Palette className="w-8 h-8" />,
                  title: "Brand Matching",
                  description: "Customize colors to match your brand"
                },
                {
                  icon: <ExternalLink className="w-8 h-8" />,
                  title: "Easy Sharing",
                  description: "Share your menu with a simple link"
                }
              ].map((feature, index) => (
                <Card key={index} className="shadow-card hover:shadow-warm transition-all duration-300 text-center">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-16">
              <Button 
                size="lg" 
                onClick={() => setShowBuilder(true)}
                className="text-lg px-8 py-6 bg-gradient-warm hover:shadow-warm transition-all duration-300 transform hover:scale-105"
              >
                Start Building Your Menu
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold gradient-warm bg-clip-text text-transparent">
                Menu Builder
              </h1>
              <p className="text-muted-foreground">
                {restaurantName || "Your Restaurant"} Menu
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowBuilder(false)}>
                Back to Home
              </Button>
              <Button className="bg-gradient-warm">
                Publish Menu
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="build" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
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
              <h2 className="text-3xl font-bold mb-4">Menu Preview</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This is how your customers will see your menu. Make sure everything looks perfect!
              </p>
            </div>
            <MenuPreview 
              menuItems={menuItems}
              restaurantName={restaurantName}
              colors={colors}
            />
            
            {menuItems.length > 0 && (
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Share Your Menu
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Menu Link:</p>
                    <code className="text-primary font-mono text-sm">
                      https://yourmenu.com/{restaurantName.toLowerCase().replace(/\s+/g, '-') || 'restaurant'}
                    </code>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 bg-gradient-warm">
                      <QrCode className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                    <Button variant="outline" className="flex-1">
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
  );
};

export default Index;
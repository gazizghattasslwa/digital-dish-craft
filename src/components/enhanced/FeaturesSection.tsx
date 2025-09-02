import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Smartphone, 
  QrCode, 
  Palette, 
  ExternalLink, 
  Globe, 
  Shield, 
  BarChart3, 
  Clock,
  Users,
  TrendingUp,
  Star,
  ArrowRight
} from "lucide-react";

export const FeaturesSection = () => {
  const mainFeatures = [
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Optimized for smartphones and tablets with responsive layouts that look perfect on every screen size."
    },
    {
      icon: <QrCode className="w-8 h-8" />,
      title: "Instant QR Codes",
      description: "Generate QR codes instantly for contactless menu access. Perfect for table service and takeout."
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "Brand Customization",
      description: "Customize colors, fonts, and layouts to match your restaurant's unique brand identity."
    },
    {
      icon: <ExternalLink className="w-8 h-8" />,
      title: "Easy Sharing",
      description: "Share your menu with a simple link across social media, websites, and messaging platforms."
    }
  ];

  const advancedFeatures = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Language Support",
      description: "Serve international customers with multi-language menu options"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track menu views, popular items, and customer engagement"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-Time Updates",
      description: "Update prices and availability instantly across all platforms"
    }
  ];

  const stats = [
    { number: "1000+", label: "Restaurants", icon: <Users className="w-5 h-5" /> },
    { number: "50K+", label: "Menu Views", icon: <TrendingUp className="w-5 h-5" /> },
    { number: "4.9/5", label: "Rating", icon: <Star className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <>
      {/* Main Features Section */}
      <section className="section-padding bg-gradient-surface">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Everything You Need to Go
              <span className="text-gradient block mt-2">Digital</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              From menu creation to customer engagement, we provide all the tools your restaurant needs to succeed in the digital age.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="group shadow-card hover:shadow-warm transition-all duration-300 border-0 bg-card/50 backdrop-blur-sm hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-warm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300">
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="section-padding">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
                <BarChart3 className="w-4 h-4 mr-2" />
                Advanced Capabilities
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                Built for Modern Restaurants
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                MenuCraft goes beyond basic digital menus. Our platform provides enterprise-grade features 
                that help restaurants optimize operations, engage customers, and increase revenue.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advancedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-primary">
                        {feature.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <Card key={index} className="text-center p-6 shadow-card hover:shadow-warm transition-all duration-300 hover-lift">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-4">
                        <div className="text-white">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-foreground mb-1">{stat.number}</div>
                      <div className="text-muted-foreground text-sm">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent/10 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container-fluid relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to Transform Your Restaurant?
            </h2>
            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of restaurants already using MenuCraft to create better customer experiences and increase revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-glow transition-spring hover:-translate-y-1">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6 backdrop-blur-sm">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </section>
    </>
  );
};
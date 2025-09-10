import { QrCode, Calendar, ShoppingCart, Palette, Star, Phone, Globe, DollarSign } from "lucide-react";
export const NewFeaturesSection = () => {
  const features = [{
    icon: QrCode,
    title: "One QR, Change Anytime",
    description: "Update your menu instantly without reprinting QR codes. One QR code for life."
  }, {
    icon: Calendar,
    title: "Reservation Forms",
    description: "Built-in reservation system that integrates seamlessly with your menu experience."
  }, {
    icon: ShoppingCart,
    title: "Cart & Ordering",
    description: "Enable customers to build their order and send it directly to your kitchen.",
    badge: "Soon"
  }, {
    icon: Palette,
    title: "Menu Customization",
    description: "Design beautiful menus with custom colors, fonts, and layouts that match your restaurant's brand."
  }, {
    icon: Star,
    title: "Rate Items",
    description: "Collect customer feedback on dishes to improve your menu and service."
  }, {
    icon: Phone,
    title: "Call the Waiter",
    description: "Let customers call for service directly from the menu with one simple tap."
  }, {
    icon: Globe,
    title: "Custom Domain",
    description: "Use your own domain name for a professional, branded experience."
  }, {
    icon: DollarSign,
    title: "Currency Selection & Multi-Language",
    description: "Support multiple currencies & languages for international customers and tourists."
  }];
  return <section id="features" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 bg-purple-100">
            Everything You Need
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for{" "}
            <span className="text-accent">Modern Restaurants</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From menu customization to multi-language support, we provide all the tools you need to create exceptional dining experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => <div key={index} className="relative bg-card border border-border rounded-2xl p-8 hover:border-primary/20 transition-all duration-300">
              {feature.badge && <div className="absolute -top-2 -right-2 bg-accent text-foreground px-2 py-1 rounded-lg text-xs font-medium">
                  {feature.badge}
                </div>}
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <feature.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>)}
        </div>

        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-8">Ready to transform your restaurant experience?</p>
          <button className="bg-accent text-foreground hover:bg-accent/90 px-8 py-3 font-medium transition-colors rounded-full">
            Get Started Today
          </button>
        </div>
      </div>
    </section>;
};
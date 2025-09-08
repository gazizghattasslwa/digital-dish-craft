import { Zap, Shield, Heart } from "lucide-react";
import { CheckCircle } from "lucide-react";

export const SmartChoiceSection = () => {
  const benefits = [
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Lightning Fast Setup",
      description: "Get your digital menu live in under 10 minutes. No technical skills required - just upload your menu and customize."
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Secure & Reliable", 
      description: "Bank-level security with 99.9% uptime guarantee. Your menu is always accessible when customers need it."
    },
    {
      icon: <Heart className="w-6 h-6 text-primary" />,
      title: "Customer Focused",
      description: "Designed with the dining experience in mind. Beautiful, intuitive interfaces that customers love to use."
    }
  ];

  const leftFeatures = [
    "No monthly fees for basic features",
    "Mobile-optimized design", 
    "24/7 customer support",
    "SEO optimized"
  ];

  const rightFeatures = [
    "Unlimited menu updates",
    "Analytics and insights",
    "No coding required",
    "Social media integration"
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-fluid">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
                  Why Menius?
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in">
                  The Smart Choice for
                  <span className="block text-gradient mt-2">
                    Modern Restaurants
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground mt-6 leading-relaxed animate-fade-in">
                  Join thousands of restaurants that have transformed their 
                  business with our digital menu platform. Here's why they chose 
                  us over the competition.
                </p>
              </div>
              
              {/* Benefits */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4 animate-fade-in hover:translate-x-2 transition-transform duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right Content - Feature Box */}
            <div className="bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Everything Included</h3>
              
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  {leftFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {rightFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm animate-fade-in" style={{ animationDelay: `${(index + 4) * 100}ms` }}>
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div className="animate-fade-in">
                    <div className="text-3xl font-bold text-primary mb-1">30%</div>
                    <div className="text-sm text-muted-foreground">Increase in Orders</div>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="text-3xl font-bold text-primary mb-1">90%</div>
                    <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
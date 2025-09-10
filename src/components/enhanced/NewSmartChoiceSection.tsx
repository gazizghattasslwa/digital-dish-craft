import { Zap, Shield, Heart, Check } from "lucide-react";

export const NewSmartChoiceSection = () => {
  const benefits = [
    {
      icon: Zap,
      title: "Lightning Fast Setup",
      description: "Get your digital menu live in under 10 minutes. No technical skills required - just upload your menu and customize."
    },
    {
      icon: Shield, 
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee. Your menu is always accessible when customers need it."
    },
    {
      icon: Heart,
      title: "Customer Focused", 
      description: "Designed with the dining experience in mind. Beautiful, intuitive interfaces that customers love to use."
    }
  ];

  const leftFeatures = [
    "No monthly fees for basic features",
    "Mobile-optimized design",
    "24/7 customer support"
  ];

  const rightFeatures = [
    "Unlimited menu updates",
    "Analytics and insights", 
    "No coding required",
    "Social media integration"
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-block bg-accent/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              Why Menura?
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              The Smart Choice for{" "}
              <span className="text-primary">Modern Restaurants</span>
            </h2>
            
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              Join thousands of restaurants that have transformed their business with our digital menu platform. Here's why they chose us over the competition.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Features card */}
          <div className="bg-foreground text-background rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-8 text-center">Everything Included</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                {leftFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                {rightFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-background/20 pt-8">
              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">30%</div>
                  <div className="text-sm text-background/70">Increase in Orders</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-accent mb-2">90%</div>
                  <div className="text-sm text-background/70">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
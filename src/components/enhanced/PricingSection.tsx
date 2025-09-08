import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      subtitle: "Perfect for small restaurants getting started",
      features: [
        "1 Digital Menu",
        "Basic Customization", 
        "QR Code Generation",
        "Mobile Optimized",
        "Community Support"
      ],
      buttonText: "Get Started Free",
      popular: false,
      dark: false
    },
    {
      name: "Professional", 
      price: "$19",
      priceUnit: "/month",
      subtitle: "Ideal for growing restaurants with advanced needs",
      features: [
        "Unlimited Menus",
        "Advanced Customization",
        "Custom Domain",
        "Analytics Dashboard", 
        "Priority Support",
        "Multi-language Support",
        "Reservation System"
      ],
      buttonText: "Start Free Trial",
      popular: true,
      dark: true
    },
    {
      name: "Enterprise",
      price: "$49", 
      priceUnit: "/month",
      subtitle: "For restaurant chains and large establishments",
      features: [
        "Everything in Professional",
        "Multi-location Management",
        "White-label Solution",
        "API Access",
        "Dedicated Account Manager",
        "Custom Integrations",
        "Advanced Analytics"
      ],
      buttonText: "Contact Sales",
      popular: false,
      dark: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container-fluid">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Choose the Perfect <span className="text-gradient">Plan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Start free and scale as you grow. No hidden fees, no long-term contracts. Cancel anytime with full data export.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl animate-fade-in ${
                plan.dark 
                  ? 'bg-foreground text-background border-2 border-primary shadow-2xl' 
                  : 'bg-card hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className={`text-2xl font-bold ${plan.dark ? 'text-background' : 'text-foreground'}`}>
                  {plan.name}
                </CardTitle>
                <div className="py-4">
                  <div className={`text-4xl sm:text-5xl font-bold ${plan.dark ? 'text-background' : 'text-foreground'}`}>
                    {plan.price}
                    {plan.priceUnit && (
                      <span className={`text-lg font-normal ${plan.dark ? 'text-background/80' : 'text-muted-foreground'}`}>
                        {plan.priceUnit}
                      </span>
                    )}
                  </div>
                </div>
                <CardDescription className={`${plan.dark ? 'text-background/80' : 'text-muted-foreground'} leading-relaxed`}>
                  {plan.subtitle}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.dark ? 'text-accent' : 'text-primary'} flex-shrink-0`} />
                      <span className={`text-sm ${plan.dark ? 'text-background/90' : 'text-muted-foreground'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full py-6 text-lg font-semibold hover-lift transition-all duration-300 ${
                    plan.dark 
                      ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-glow' 
                      : plan.name === 'Enterprise'
                      ? 'variant-outline border-2 hover:bg-muted/50'
                      : 'btn-primary'
                  }`}
                  variant={plan.dark ? 'default' : plan.name === 'Enterprise' ? 'outline' : 'default'}
                  onClick={() => {
                    if (plan.name === 'Enterprise') {
                      // Handle contact sales
                      return;
                    }
                    handleGetStarted();
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12 space-y-4 animate-fade-in">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

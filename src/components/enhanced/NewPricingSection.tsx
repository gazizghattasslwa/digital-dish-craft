import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const NewPricingSection = () => {
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
      description: "Perfect for small restaurants getting started",
      features: [
        "1 Digital Menu",
        "Basic Customization", 
        "QR Code Generation",
        "Mobile Optimized",
        "Community Support"
      ],
      buttonText: "Get Started Free",
      popular: false
    },
    {
      name: "Professional", 
      price: "$19",
      period: "/month",
      description: "Ideal for growing restaurants with advanced needs",
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
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49", 
      period: "/month",
      description: "For restaurant chains and large establishments",
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
      popular: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Choose the Perfect{" "}
            <span className="text-primary">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no long-term contracts. Cancel anytime with full data export.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative p-8 ${
                plan.popular 
                  ? 'border-primary bg-foreground text-background' 
                  : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-bold mb-2 ${
                  plan.popular ? 'text-background' : 'text-foreground'
                }`}>
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className={`text-4xl font-bold ${
                    plan.popular ? 'text-background' : 'text-foreground'
                  }`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ${
                      plan.popular ? 'text-background/70' : 'text-muted-foreground'
                    }`}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className={`${
                  plan.popular ? 'text-background/70' : 'text-muted-foreground'
                }`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${
                      plan.popular 
                        ? 'text-accent' 
                        : 'text-primary'
                    }`} />
                    <span className={`${
                      plan.popular ? 'text-background' : 'text-foreground'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                onClick={plan.name === 'Enterprise' ? () => {} : handleGetStarted}
              >
                {plan.buttonText}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-2">All plans include a 14-day free trial. No credit card required.</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              No setup fees
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              24/7 support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
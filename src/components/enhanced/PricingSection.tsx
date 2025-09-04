import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const PricingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = (planType: string) => {
    if (user) {
      if (planType === 'free') {
        navigate('/dashboard');
      } else {
        navigate('/subscription');
      }
    } else {
      navigate('/auth?tab=signup');
    }
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      icon: <Star className="w-6 h-6" />,
      features: [
        "1 Restaurant Menu",
        "Basic Menu Templates",
        "QR Code Generation",
        "Mobile Responsive Design",
        "Basic Customization",
        "Public Menu Sharing"
      ],
      buttonText: "Get Started Free",
      buttonVariant: "outline" as const,
      popular: false
    },
    {
      name: "Premium",
      price: "$7.99",
      period: "per month",
      description: "For growing restaurants",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Unlimited Restaurant Menus",
        "All Premium Templates",
        "Advanced Branding Options",
        "Custom Colors & Fonts",
        "Analytics Dashboard",
        "Priority Support",
        "Menu Categories & Items",
        "Special Item Highlighting"
      ],
      buttonText: "Start Premium",
      buttonVariant: "default" as const,
      popular: true
    },
    {
      name: "Enterprise",
      price: "$19.99",
      period: "per month",
      description: "For restaurant chains",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Premium",
        "Multi-location Management",
        "White-label Solutions",
        "API Access",
        "Custom Integrations",
        "Dedicated Account Manager",
        "Advanced Analytics",
        "Priority Phone Support"
      ],
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="section-padding bg-gradient-surface">
      <div className="container-fluid">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Crown className="w-4 h-4 mr-2" />
            Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Choose Your Perfect
            <span className="text-gradient block mt-2">Plan</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All plans include our core features with no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative flex flex-col shadow-card hover:shadow-primary transition-all duration-300 hover-lift ${
                plan.popular ? 'border-primary shadow-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
                  plan.popular ? 'bg-gradient-primary' : 'bg-muted'
                }`}>
                  <div className={plan.popular ? 'text-white' : 'text-muted-foreground'}>
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-grow flex flex-col pt-0">
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full mt-auto transition-all duration-300 ${
                    plan.popular 
                      ? 'btn-primary shadow-primary hover:shadow-glow' 
                      : 'hover:bg-primary hover:text-primary-foreground'
                  }`}
                  onClick={() => handleGetStarted(plan.name.toLowerCase())}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-left p-4 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-foreground mb-2">Can I change plans anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div className="text-left p-4 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-foreground mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground text-sm">
                Yes! Our free plan lets you create your first menu with no time limits or credit card required.
              </p>
            </div>
            <div className="text-left p-4 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-foreground mb-2">What payment methods do you accept?</h4>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and bank transfers for enterprise plans.
              </p>
            </div>
            <div className="text-left p-4 rounded-lg bg-muted/30">
              <h4 className="font-semibold text-foreground mb-2">Can I cancel anytime?</h4>
              <p className="text-muted-foreground text-sm">
                Absolutely. Cancel anytime with no penalties. Your data remains accessible during the billing period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Briefcase } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { toast } from "sonner";

interface PricingPlansProps {
  onUpgrade?: (plan: 'premium' | 'agency') => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onUpgrade }) => {
  const { subscriptionTier, createCheckout, loading } = useSubscription();

  const handleUpgrade = async (plan: 'premium' | 'agency') => {
    try {
      const url = await createCheckout(plan);
      window.open(url, '_blank');
      onUpgrade?.(plan);
    } catch (error) {
      toast.error('Failed to create checkout session');
      console.error('Checkout error:', error);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0€',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        '1 restaurant',
        '1 menu per restaurant',
        'Up to 20 menu items',
        'QR code generation',
        'Basic templates only',
        'Lovable branding'
      ],
      icon: <Check className="h-6 w-6" />,
      current: subscriptionTier === 'free',
      buttonText: 'Current Plan',
      buttonDisabled: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '19.99€',
      period: '/month',
      description: 'Great for small restaurants',
      features: [
        'Up to 2 restaurants',
        'Unlimited menus per restaurant',
        'Unlimited menu items',
        'QR code generation',
        'All templates',
        'Remove Lovable branding'
      ],
      icon: <Star className="h-6 w-6" />,
      current: subscriptionTier === 'premium',
      buttonText: subscriptionTier === 'premium' ? 'Current Plan' : 'Upgrade to Premium',
      buttonDisabled: subscriptionTier === 'premium',
      popular: true,
    },
    {
      id: 'agency',
      name: 'Agency',
      price: '79.99€',
      period: '/month',
      description: 'Perfect for agencies and multiple clients',
      features: [
        'Up to 100 restaurants',
        'Unlimited menus per restaurant',
        'Unlimited menu items',
        'QR code generation',
        'All templates',
        'Custom restaurant branding',
        'Priority support'
      ],
      icon: <Briefcase className="h-6 w-6" />,
      current: subscriptionTier === 'agency',
      buttonText: subscriptionTier === 'agency' ? 'Current Plan' : 'Upgrade to Agency',
      buttonDisabled: subscriptionTier === 'agency',
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <Card 
          key={plan.id} 
          className={`relative ${plan.current ? 'ring-2 ring-primary' : ''} ${plan.popular ? 'border-primary' : ''}`}
        >
          {plan.popular && (
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
              Most Popular
            </Badge>
          )}
          {plan.current && (
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-500 text-white">
              Current Plan
            </Badge>
          )}
          
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              {plan.icon}
            </div>
            <CardTitle className="text-xl">{plan.name}</CardTitle>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.current ? "outline" : "default"}
              disabled={plan.buttonDisabled || loading}
              onClick={() => plan.id !== 'free' && !plan.buttonDisabled && handleUpgrade(plan.id as 'premium' | 'agency')}
            >
              {plan.buttonText}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
import React from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PricingPlans } from "@/components/subscription/PricingPlans";
import { ArrowLeft, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Subscription() {
  const { subscribed, subscriptionTier, subscriptionEnd, openCustomerPortal, loading } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      const url = await openCustomerPortal();
      window.open(url, '_blank');
    } catch (error) {
      toast.error('Failed to open customer portal');
      console.error('Portal error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the perfect plan for your restaurant business
          </p>
        </div>

        {subscribed && (
          <Card className="mb-8 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Plan:</span>
                <span className="font-semibold capitalize">{subscriptionTier}</span>
              </div>
              {subscriptionEnd && (
                <div className="flex justify-between items-center">
                  <span>Next billing:</span>
                  <span className="font-semibold">
                    {new Date(subscriptionEnd).toLocaleDateString()}
                  </span>
                </div>
              )}
              <Button 
                onClick={handleManageSubscription}
                disabled={loading}
                className="w-full"
              >
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        )}

        <PricingPlans />
      </div>
    </div>
  );
}
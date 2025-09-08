import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const TransformSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const benefits = [
    "Setup in 10 minutes",
    "No technical skills needed", 
    "Free to start"
  ];

  const features = [
    "Free 14-day trial",
    "No credit card required",
    "Cancel anytime"
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-fluid text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm font-medium animate-fade-in">
            ✨ Ready to Transform Your
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight animate-fade-in">
            Ready to Transform Your
            <span className="block text-gradient mt-2">
              Restaurant?
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-fade-in">
            Join thousands of restaurants already using Menius to create beautiful 
            digital menus and enhance their customer experience.
          </p>
          
          {/* Benefits Grid */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 text-muted-foreground py-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 animate-fade-in hover:text-primary transition-colors" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm sm:text-base font-medium">{benefit}</span>
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 btn-primary hover-lift transform hover:scale-105 transition-all duration-300"
              onClick={handleGetStarted}
            >
              Start Building Your Menu →
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300"
            >
              View Live Demo
            </Button>
          </div>
          
          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm text-muted-foreground pt-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground animate-fade-in">
            Trusted by 1000+ restaurants worldwide
          </p>
        </div>
      </div>
    </section>
  );
};
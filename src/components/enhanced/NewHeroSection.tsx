import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const NewHeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth?tab=signup');
    }
  };

  return (
    <section className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="relative z-20 p-4 sm:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-foreground">
            Menura
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-foreground hover:text-primary transition-colors">How it works</a>
            <a href="#samples" className="text-foreground hover:text-primary transition-colors">Samples</a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </div>
          <div className="flex gap-2 sm:gap-4">
            {user ? (
              <Button 
                variant="outline" 
                className="text-foreground border-border"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="text-foreground border-border"
                  onClick={() => navigate('/auth?tab=signin')}
                >
                  Login
                </Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  Build your menu for free
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - QR Code */}
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-64 h-64 bg-card border border-border rounded-2xl flex items-center justify-center">
                <QrCode className="w-48 h-48 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium">
                Generate a QR code
              </div>
            </div>
          </div>
          
          {/* Center - Main Content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-block bg-accent/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              Transform Your Restaurant Menu
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Digital Menus Made{" "}
              <span className="text-accent">Simple</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              Convert your PDF menus, images, or create from scratch. Get a beautiful, mobile-friendly digital menu with QR codes in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg"
                onClick={handleGetStarted}
              >
                Create Your Menu
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-border text-foreground hover:bg-muted px-8 py-4 text-lg"
              >
                View Demo
              </Button>
            </div>
            
            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">1000+</div>
                <div className="text-sm text-muted-foreground">Active Restaurants</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">50K+</div>
                <div className="text-sm text-muted-foreground">Menu Views Daily</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
          
          {/* Right side - Menu Preview */}
          <div className="lg:w-1/3 flex justify-center">
            <div className="relative">
              <div className="w-48 h-80 bg-card border border-border rounded-2xl p-6 transform rotate-3">
                <div className="w-full h-20 bg-accent/20 rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 bg-accent rounded-full"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                  <div className="h-2 bg-muted rounded w-full"></div>
                  <div className="mt-4 h-6 bg-primary/20 rounded w-16 ml-auto flex items-center justify-center">
                    <span className="text-xs text-primary font-bold">10$</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium">
                Pizza Margherita
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
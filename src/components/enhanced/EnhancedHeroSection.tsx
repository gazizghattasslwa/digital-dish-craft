import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Palette, Star, Play, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "./MobileNav";

export const EnhancedHeroSection = () => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6">
        <div className="container-fluid flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-white">
              MenuCraft
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 sm:gap-4 items-center">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 text-sm sm:text-base transition-spring"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 text-sm sm:text-base transition-spring"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              How It Works
            </Button>
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 text-sm sm:text-base transition-spring"
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Pricing
            </Button>
            {user ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 text-sm sm:text-base transition-spring"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10 text-sm sm:text-base px-3 sm:px-4 transition-spring"
                  onClick={() => navigate('/auth?tab=signin')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base px-3 sm:px-4 shadow-glow transition-spring hover:-translate-y-0.5"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav />
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="relative z-10 container-fluid text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full glass-card text-white text-sm font-medium backdrop-blur-md">
            <Star className="w-4 h-4 mr-2 text-accent" />
            Trusted by 1000+ Restaurants
          </div>
          
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
            Your Menu, Reimagined.
            <span className="block text-gradient mt-2">
              Instantly.
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed">
            Go from a static PDF to a dynamic, interactive digital menu that customers love. 
            Upload your menu, customize your brand, and publish in minutes.
          </p>
          
          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-white/90 text-sm sm:text-base">
            {[
              "AI-Powered Menu Extraction",
              "Beautiful, Customizable Templates", 
              "Instant QR Code Generation",
              "Real-Time Updates"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-accent" />
                {benefit}
              </div>
            ))}
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 btn-primary hover-lift"
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Create Your Menu Now'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-spring backdrop-blur-sm"
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};
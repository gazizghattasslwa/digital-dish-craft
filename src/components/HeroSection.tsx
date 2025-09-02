import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Zap, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-restaurant-menu.jpg";

export const HeroSection = () => {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Restaurant digital menu showcase"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            MenuCraft
          </div>
          <div className="space-x-4">
            {user ? (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/auth?tab=signin')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
            Digitize Your
            <span className="block text-transparent bg-gradient-to-r from-primary to-accent bg-clip-text">
              Restaurant Menu
            </span>
            in Minutes
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Transform your static PDF menu into a beautiful, dynamic digital experience. 
            Get a QR code, shareable link, and easy updates for your restaurant.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-warm hover:shadow-warm transition-all duration-300 transform hover:scale-105"
              onClick={handleGetStarted}
            >
              {user ? 'Go to Dashboard' : 'Create Your Menu'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              See Examples
            </Button>
          </div>
          
          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Mobile Optimized</h3>
              <p className="text-gray-300 text-sm">Perfect viewing experience on all devices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Quick Updates</h3>
              <p className="text-gray-300 text-sm">Change prices and items instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Brand Customization</h3>
              <p className="text-gray-300 text-sm">Match your restaurant's unique style</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
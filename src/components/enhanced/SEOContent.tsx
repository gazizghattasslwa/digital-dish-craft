import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Clock, 
  Shield,
  TrendingUp,
  MessageSquare,
  Award
} from "lucide-react";

export const SEOContent = () => {
  const benefits = [
    "No setup fees or monthly subscriptions",
    "Mobile-optimized responsive design",
    "Instant QR code generation",
    "Real-time menu updates",
    "Custom branding and colors",
    "Multi-language support",
    "Analytics and insights",
    "24/7 customer support"
  ];

  const testimonials = [
    {
      name: "Maria Rodriguez",
      restaurant: "La Bella Vita",
      rating: 5,
      text: "MenuCraft transformed our customer experience. Orders increased by 30% since switching to digital menus!"
    },
    {
      name: "James Chen",
      restaurant: "Dragon Noodle House", 
      rating: 5,
      text: "The QR code feature saved us during COVID. Now customers prefer it even more than physical menus."
    },
    {
      name: "Sarah Thompson",
      restaurant: "Green Garden Café",
      rating: 5,
      text: "Super easy to update prices and seasonal items. The customization options perfectly match our brand."
    }
  ];

  const faqs = [
    {
      question: "How quickly can I create a digital menu?",
      answer: "Most restaurants have their digital menu ready in under 15 minutes. Simply upload your existing menu or create one from scratch using our intuitive builder."
    },
    {
      question: "Do I need technical skills to use MenuCraft?",
      answer: "Not at all! MenuCraft is designed for restaurant owners without technical expertise. Our drag-and-drop interface makes menu creation as easy as editing a document."
    },
    {
      question: "Can customers view my menu without downloading an app?",
      answer: "Yes! Your digital menu works on any smartphone browser. Customers simply scan the QR code or visit your menu link - no app download required."
    },
    {
      question: "How do I update menu items and prices?",
      answer: "Changes are instant! Log into your dashboard, edit any item or price, and it's immediately updated across all platforms where your menu appears."
    }
  ];

  return (
    <>
      {/* Benefits Section */}
      <section className="section-padding">
        <div className="container-fluid">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Award className="w-4 h-4 mr-2" />
                Why Choose MenuCraft
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
                The Complete Digital Menu Solution
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                MenuCraft provides everything restaurants need to create professional digital menus 
                that enhance customer experience and streamline operations. Join thousands of satisfied restaurant owners.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button size="lg" className="mt-8 btn-primary hover-lift">
                Start Creating Your Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-card hover:shadow-warm transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">1000+</div>
                    <div className="text-muted-foreground text-sm">Active Restaurants</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card hover:shadow-warm transition-all duration-300 mt-8">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">150K+</div>
                    <div className="text-muted-foreground text-sm">Menu Views</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card hover:shadow-warm transition-all duration-300 -mt-4">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-warm rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">99.9%</div>
                    <div className="text-muted-foreground text-sm">Uptime</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card hover:shadow-warm transition-all duration-300 mt-4">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">24/7</div>
                    <div className="text-muted-foreground text-sm">Support</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4 mr-2" />
              Customer Success Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Loved by Restaurant Owners Everywhere
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              See how MenuCraft helps restaurants increase customer satisfaction and boost revenue with digital menus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-card hover:shadow-warm transition-all duration-300 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-accent fill-current" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-muted-foreground text-sm">{testimonial.restaurant}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding">
        <div className="container-fluid">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about creating and managing digital menus with MenuCraft.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="shadow-card hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
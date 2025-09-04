
import { Smartphone, Upload, QrCode, Sparkles } from "lucide-react";

export const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="container-fluid">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">How It Works</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Create your stunning digital menu in just a few simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Upload className="w-10 h-10 text-primary" />,
              title: "Upload Your Menu",
              description: "Upload your existing menu in PDF, DOCX, or even an image. Our AI will extract the items, descriptions, and prices for you.",
            },
            {
              icon: <Smartphone className="w-10 h-10 text-primary" />,
              title: "Customize Your Design",
              description: "Choose from our beautiful templates and customize the colors, fonts, and layout to match your brand.",
            },
            {
              icon: <QrCode className="w-10 h-10 text-primary" />,
              title: "Generate QR Code",
              description: "Instantly generate a unique QR code for your menu. Print it and place it on your tables for customers to scan.",
            },
            {
                icon: <Sparkles className="w-10 h-10 text-primary" />,
                title: "Publish and Share",
                description: "Your digital menu is live! Share it on social media, your website, or anywhere you want. Update it anytime.",
            }
          ].map((step, index) => (
            <div key={index} className="text-center p-6 rounded-lg border shadow-sm">
              <div className="flex justify-center items-center mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How quickly can I set up my digital menu?",
      answer: "You can have your digital menu up and running in under 10 minutes. Simply upload your existing menu, customize the design, and publish. No technical skills required."
    },
    {
      question: "Do I need to reprint QR codes when I update my menu?",
      answer: "No! That's the beauty of digital menus. Your QR code stays the same forever. When you update prices or items, changes appear instantly on your digital menu without needing new QR codes."
    },
    {
      question: "Can customers place orders directly through the menu?",
      answer: "Yes, with our Professional and Enterprise plans, you can enable direct ordering functionality that integrates seamlessly with your existing POS system or kitchen workflow."
    },
    {
      question: "Is my menu mobile-friendly?",
      answer: "Absolutely! All our menus are designed mobile-first and work perfectly on smartphones, tablets, and desktop computers. Your customers will have a great experience on any device."
    },
    {
      question: "Can I use my own domain name?",
      answer: "Yes, with our Professional and Enterprise plans, you can use your own custom domain (like menu.yourrestaurant.com) for a fully branded experience."
    },
    {
      question: "What about menu translations for international customers?",
      answer: "Our Professional plan includes multi-language support, allowing you to offer your menu in multiple languages with easy switching for international customers and tourists."
    },
    {
      question: "How do analytics help my restaurant?",
      answer: "Our analytics show you which dishes are viewed most, peak browsing times, and customer behavior patterns. This data helps you optimize your menu layout and pricing strategy."
    },
    {
      question: "What if I need help setting up my menu?",
      answer: "We provide comprehensive support! Our Starter plan includes community support, while Professional and Enterprise plans get priority support from our expert team."
    },
    {
      question: "Can I try before committing to a paid plan?",
      answer: "Absolutely! All plans come with a 14-day free trial. You can explore all features with no credit card required and cancel anytime if you're not satisfied."
    },
    {
      question: "What happens if I want to cancel?",
      answer: "You can cancel anytime with full data export. There are no cancellation fees or long-term contracts. Your data remains accessible during your billing period."
    }
  ];

  return (
    <section className="section-padding bg-background">
      <div className="container-fluid">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 animate-fade-in">
            Questions
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary transition-colors py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="text-center mt-12 p-8 bg-muted/30 rounded-2xl border border-border animate-fade-in">
            <h3 className="text-xl font-semibold text-foreground mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our support team is here to help you succeed.</p>
            <Button size="lg" className="btn-primary hover-lift">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
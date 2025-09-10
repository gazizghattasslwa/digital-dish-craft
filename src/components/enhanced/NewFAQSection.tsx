import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
export const NewFAQSection = () => {
  const faqs = [{
    question: "How quickly can I set up my digital menu?",
    answer: "You can have your digital menu up and running in under 10 minutes. Simply upload your existing menu (PDF, image, or enter items manually), customize the design, and generate your QR code. No technical skills required."
  }, {
    question: "Do I need to reprint QR codes when I update my menu?",
    answer: "No! Once you generate your QR code, it stays the same forever. You can update prices, add new items, or change descriptions anytime, and customers will always see the latest version when they scan."
  }, {
    question: "Can customers place orders directly through the menu?",
    answer: "Yes! Our cart and ordering feature allows customers to build their order and send it directly to your kitchen. This feature is coming soon and will be included in all paid plans."
  }, {
    question: "Is my menu mobile-friendly?",
    answer: "Absolutely! All menus are automatically optimized for mobile devices. They load quickly, are easy to navigate, and look great on any screen size - from phones to tablets to desktops."
  }, {
    question: "Can I use my own domain name?",
    answer: "Yes! With our Professional and Enterprise plans, you can use your own custom domain (like menu.yourrestaurant.com) for a fully branded experience."
  }, {
    question: "What about menu translations for international customers?",
    answer: "Our multi-language support allows you to create menus in multiple languages and currencies. Perfect for tourist areas or international restaurants. Available on Professional and Enterprise plans."
  }, {
    question: "How do analytics help my restaurant?",
    answer: "Our analytics show you which items are viewed most, peak viewing times, and customer behavior patterns. This data helps you optimize your menu, pricing, and inventory decisions."
  }];
  return <section className="section-padding bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-accent/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Frequently Asked{" "}
            <span className="text-accent">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about creating and managing your digital restaurant menu.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-xl px-6">
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>)}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Button variant="outline" className="border-border text-foreground hover:bg-muted rounded-full">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface MenuTemplatePreviewProps {
  template: string;
  primaryColor: string;
  secondaryColor: string;
  isSelected?: boolean;
}

const mockRestaurant = {
  name: "Sample Restaurant",
  description: "Delightful cuisine crafted with passion",
  logo_url: null,
  address: "123 Main St, City",
  phone: "(555) 123-4567",
  website: "https://example.com"
};

const mockCategories = [
  { id: "1", name: "Appetizers", description: "Start your meal right" },
  { id: "2", name: "Main Courses", description: "Our signature dishes" }
];

const mockItems = [
  {
    id: "1",
    name: "Caesar Salad",
    description: "Fresh romaine lettuce with parmesan cheese",
    price: 12.99,
    currency: "USD",
    category_id: "1",
    is_special: false,
    is_available: true
  },
  {
    id: "2", 
    name: "Grilled Salmon",
    description: "Atlantic salmon with seasonal vegetables",
    price: 24.99,
    currency: "USD", 
    category_id: "2",
    is_special: true,
    is_available: true
  }
];

export function MenuTemplatePreview({ 
  template, 
  primaryColor, 
  secondaryColor, 
  isSelected = false 
}: MenuTemplatePreviewProps) {
  const restaurant = { ...mockRestaurant, primary_color: primaryColor, secondary_color: secondaryColor };

  const renderPreview = () => {
    switch (template) {
      case 'classic':
        return (
          <div className="p-4 bg-white rounded-lg">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-bold mb-2" style={{ color: primaryColor }}>
                  Appetizers
                </h4>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div>
                    <div className="font-medium">Caesar Salad</div>
                    <div className="text-xs text-gray-500">Fresh romaine lettuce...</div>
                  </div>
                  <div className="font-bold" style={{ color: primaryColor }}>$12.99</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'modern':
        return (
          <div 
            className="p-4 rounded-lg text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
          >
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-1">{restaurant.name}</h3>
              <p className="text-sm opacity-90">{restaurant.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 rounded p-2">
                <div className="font-medium text-sm">Caesar Salad</div>
                <div className="text-lg font-bold">$12.99</div>
              </div>
              <div className="bg-white/10 rounded p-2 relative">
                <Badge className="absolute -top-1 -right-1 text-xs" style={{ backgroundColor: secondaryColor }}>
                  <Star className="w-2 h-2 mr-1" />
                </Badge>
                <div className="font-medium text-sm">Grilled Salmon</div>
                <div className="text-lg font-bold">$24.99</div>
              </div>
            </div>
          </div>
        );

      case 'elegant':
        return (
          <div className="p-4 bg-white rounded-lg">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-serif font-light mb-2" style={{ color: primaryColor }}>
                {restaurant.name}
              </h3>
              <div className="w-8 h-px bg-current mx-auto mb-2 opacity-30"></div>
              <p className="text-sm text-gray-600 italic">{restaurant.description}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="font-medium">Caesar Salad</div>
                  <div className="text-xs text-gray-500 font-light">Fresh romaine lettuce...</div>
                </div>
                <div className="font-medium ml-2" style={{ color: primaryColor }}>$12.99</div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Grilled Salmon</span>
                    <Badge variant="outline" className="text-xs" style={{ color: secondaryColor }}>
                      Special
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 font-light">Atlantic salmon...</div>
                </div>
                <div className="font-medium ml-2" style={{ color: primaryColor }}>$24.99</div>
              </div>
            </div>
          </div>
        );

      case 'casual':
        return (
          <div className="p-4 bg-white rounded-lg">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2" style={{ color: primaryColor }}>
                {restaurant.name}
              </h3>
              <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>
            
            <div className="space-y-2">
              <div 
                className="p-2 rounded border-2"
                style={{ borderColor: primaryColor }}
              >
                <div className="text-center">
                  <h4 className="font-bold" style={{ color: primaryColor }}>Appetizers</h4>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <div className="p-2 border rounded hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-sm">Caesar Salad</div>
                      <div className="text-xs text-gray-500">Fresh romaine...</div>
                    </div>
                    <div 
                      className="text-sm font-bold px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      $12.99
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="p-4 bg-gray-100 rounded-lg text-center">Preview not available</div>;
    }
  };

  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
      <CardContent className="p-0">
        <div className="h-48 overflow-hidden">
          {renderPreview()}
        </div>
      </CardContent>
    </Card>
  );
}
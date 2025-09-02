import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Eye, Palette, Layout, Utensils, Coffee } from 'lucide-react';

interface MenuTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  icon: React.ReactNode;
  features: string[];
  style: {
    layout: 'single-column' | 'two-column' | 'grid' | 'cards';
    theme: 'modern' | 'classic' | 'elegant' | 'casual';
    headerStyle: 'minimal' | 'bold' | 'image-banner' | 'gradient';
  };
}

const MENU_TEMPLATES: MenuTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional restaurant menu with clean typography and organized sections',
    preview: '/api/placeholder/400/300',
    icon: <Utensils className="w-6 h-6" />,
    features: ['Single column layout', 'Category sections', 'Price alignment', 'Clean typography'],
    style: {
      layout: 'single-column',
      theme: 'classic',
      headerStyle: 'minimal'
    }
  },
  {
    id: 'modern',
    name: 'Modern Grid',
    description: 'Contemporary grid layout with image cards and modern design elements',
    preview: '/api/placeholder/400/300',
    icon: <Layout className="w-6 h-6" />,
    features: ['Grid layout', 'Image cards', 'Modern typography', 'Hover effects'],
    style: {
      layout: 'grid',
      theme: 'modern',
      headerStyle: 'gradient'
    }
  },
  {
    id: 'elegant',
    name: 'Elegant Fine Dining',
    description: 'Sophisticated design for upscale restaurants with elegant typography',
    preview: '/api/placeholder/400/300',
    icon: <Coffee className="w-6 h-6" />,
    features: ['Two column layout', 'Elegant fonts', 'Decorative elements', 'Premium feel'],
    style: {
      layout: 'two-column',
      theme: 'elegant',
      headerStyle: 'image-banner'
    }
  },
  {
    id: 'casual',
    name: 'Casual Bistro',
    description: 'Relaxed and friendly design perfect for cafes and casual dining',
    preview: '/api/placeholder/400/300',
    icon: <Palette className="w-6 h-6" />,
    features: ['Card layout', 'Bright colors', 'Casual fonts', 'Playful design'],
    style: {
      layout: 'cards',
      theme: 'casual',
      headerStyle: 'bold'
    }
  }
];

interface MenuTemplateSelectorProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onPreview?: (templateId: string) => void;
}

export function MenuTemplateSelector({ 
  selectedTemplate, 
  onTemplateSelect, 
  onPreview 
}: MenuTemplateSelectorProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Choose Your Menu Template</h3>
        <p className="text-muted-foreground">
          Select a template that matches your restaurant's style. You can customize colors and branding later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MENU_TEMPLATES.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-warm' 
                : 'hover:shadow-card'
            } ${
              hoveredTemplate === template.id ? 'scale-[1.02]' : ''
            }`}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>
                </div>
                {selectedTemplate === template.id && (
                  <div className="p-2 bg-primary rounded-full text-primary-foreground">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Template Preview */}
              <div className="relative bg-muted/50 rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-background to-muted flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {template.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Menu Preview
                    </div>
                  </div>
                </div>
                {onPreview && (
                  <div className="absolute top-2 right-2">
                    <Button 
                      size="sm" 
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(template.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                )}
              </div>

              {/* Template Features */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Template Style Info */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium">Layout</div>
                    <div className="text-muted-foreground capitalize">
                      {template.style.layout.replace('-', ' ')}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium">Theme</div>
                    <div className="text-muted-foreground capitalize">
                      {template.style.theme}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <div className="font-medium">Header</div>
                    <div className="text-muted-foreground capitalize">
                      {template.style.headerStyle.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            ✨ <strong>{MENU_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</strong> template selected. 
            You can customize colors, fonts, and branding in the next step.
          </p>
        </div>
      )}
    </div>
  );
}
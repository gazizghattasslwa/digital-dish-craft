import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem } from "./MenuBuilder";

interface MenuPreviewProps {
  menuItems: MenuItem[];
  restaurantName: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

export const MenuPreview = ({ menuItems, restaurantName, colors }: MenuPreviewProps) => {
  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-card overflow-hidden">
      {/* Menu Header */}
      <div 
        className="p-8 text-center text-white relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${colors.primary || 'hsl(var(--primary))'} 0%, ${colors.secondary || 'hsl(var(--secondary))'} 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">
            {restaurantName || "Your Restaurant"}
          </h1>
          <p className="text-xl opacity-90">Menu</p>
        </div>
      </div>

      {/* Menu Content */}
      <div className="p-6">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
              No menu items yet
            </h3>
            <p className="text-muted-foreground">
              Add some items to see your menu preview
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category}>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-foreground">
                    {category}
                  </h2>
                  <div className="h-1 w-16 bg-gradient-warm rounded-full"></div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:shadow-menu-item transition-all duration-300 border-border/50">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-foreground">
                                {item.name}
                              </h3>
                              {item.category === "Specials" && (
                                <Badge className="bg-accent text-accent-foreground">
                                  Special
                                </Badge>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-muted-foreground leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="ml-6 flex-shrink-0">
                            <span 
                              className="text-2xl font-bold"
                              style={{ color: colors.primary || 'hsl(var(--primary))' }}
                            >
                              ${item.price.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-muted/30 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Prices subject to change. Please inform us of any allergies or dietary requirements.
        </p>
      </div>
    </div>
  );
};
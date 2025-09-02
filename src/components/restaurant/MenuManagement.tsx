import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Save, Upload, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { QuickMenuImport } from './QuickMenuImport';

interface Restaurant {
  id: string;
  name: string;
  default_currency: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category_id: string;
  image_url?: string;
  is_special: boolean;
  is_available: boolean;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface MenuManagementProps {
  restaurant: Restaurant;
  menuItems: MenuItem[];
  categories: MenuCategory[];
  onMenuItemsUpdate: (items: MenuItem[]) => void;
  onCategoriesUpdate: (categories: MenuCategory[]) => void;
}

export function MenuManagement({ 
  restaurant, 
  menuItems, 
  categories, 
  onMenuItemsUpdate, 
  onCategoriesUpdate 
}: MenuManagementProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [showItemDialog, setShowItemDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_special: false,
    is_available: true,
  });

  // Category Management
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        // Update category
        const { error } = await supabase
          .from('menu_categories')
          .update({
            name: categoryForm.name,
            description: categoryForm.description,
          })
          .eq('id', editingCategory.id);

        if (error) throw error;

        const updatedCategories = categories.map(cat => 
          cat.id === editingCategory.id 
            ? { ...cat, name: categoryForm.name, description: categoryForm.description }
            : cat
        );
        onCategoriesUpdate(updatedCategories);
      } else {
        // Create new category
        const { data, error } = await supabase
          .from('menu_categories')
          .insert({
            restaurant_id: restaurant.id,
            name: categoryForm.name,
            description: categoryForm.description,
            display_order: categories.length,
          })
          .select()
          .single();

        if (error) throw error;
        onCategoriesUpdate([...categories, data]);
      }

      toast({
        title: editingCategory ? "Category updated" : "Category created",
        description: "Menu category has been saved successfully.",
      });

      setShowCategoryDialog(false);
      setCategoryForm({ name: '', description: '' });
      setEditingCategory(null);
    } catch (error: any) {
      toast({
        title: "Error saving category",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('menu_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      onCategoriesUpdate(updatedCategories);

      // Update menu items to remove category reference
      const updatedItems = menuItems.map(item => 
        item.category_id === categoryId 
          ? { ...item, category_id: '' }
          : item
      );
      onMenuItemsUpdate(updatedItems);

      toast({
        title: "Category deleted",
        description: "Menu category has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Menu Item Management
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        name: itemForm.name,
        description: itemForm.description,
        price: parseFloat(itemForm.price),
        currency: restaurant.default_currency,
        category_id: itemForm.category_id || null,
        is_special: itemForm.is_special,
        is_available: itemForm.is_available,
      };

      if (editingItem) {
        // Update item
        const { error } = await supabase
          .from('menu_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;

        const updatedItems = menuItems.map(item => 
          item.id === editingItem.id 
            ? { ...item, ...itemData }
            : item
        );
        onMenuItemsUpdate(updatedItems);
      } else {
        // Create new item
        const { data, error } = await supabase
          .from('menu_items')
          .insert({
            restaurant_id: restaurant.id,
            ...itemData,
            display_order: menuItems.length,
          })
          .select()
          .single();

        if (error) throw error;
        onMenuItemsUpdate([...menuItems, data]);
      }

      toast({
        title: editingItem ? "Item updated" : "Item created",
        description: "Menu item has been saved successfully.",
      });

      setShowItemDialog(false);
      setItemForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        is_special: false,
        is_available: true,
      });
      setEditingItem(null);
    } catch (error: any) {
      toast({
        title: "Error saving item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      const updatedItems = menuItems.filter(item => item.id !== itemId);
      onMenuItemsUpdate(updatedItems);

      toast({
        title: "Item deleted",
        description: "Menu item has been removed.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openCategoryDialog = (category?: MenuCategory) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', description: '' });
    }
    setShowCategoryDialog(true);
  };

  const openItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setItemForm({
        name: item.name,
        description: item.description || '',
        price: item.price.toString(),
        category_id: item.category_id || '',
        is_special: item.is_special,
        is_available: item.is_available,
      });
    } else {
      setEditingItem(null);
      setItemForm({
        name: '',
        description: '',
        price: '',
        category_id: '',
        is_special: false,
        is_available: true,
      });
    }
    setShowItemDialog(true);
  };

  const handleImportComplete = (newCategories: MenuCategory[], newItems: MenuItem[]) => {
    onCategoriesUpdate([...categories, ...newCategories]);
    onMenuItemsUpdate([...menuItems, ...newItems]);
  };

  return (
    <div className="space-y-6">
      {/* Upload Options */}
      <QuickMenuImport 
        restaurant={restaurant} 
        onImportComplete={handleImportComplete}
      />

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList>
          <TabsTrigger value="categories">Categories ({categories.length})</TabsTrigger>
          <TabsTrigger value="items">Menu Items ({menuItems.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Menu Categories</h3>
            <Button onClick={() => openCategoryDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCategoryDialog(category)}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Menu Items</h3>
            <Button onClick={() => openItemDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="grid gap-4">
            {menuItems.map((item) => {
              const category = categories.find(cat => cat.id === item.category_id);
              return (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{item.name}</h4>
                          {item.is_special && (
                            <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
                              Special
                            </span>
                          )}
                          {!item.is_available && (
                            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                              Unavailable
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="font-medium">${item.price}</span>
                          {category && (
                            <span className="text-sm text-muted-foreground">
                              {category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openItemDialog(item)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="e.g., Appetizers, Main Dishes"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Optional description for this category..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCategoryDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingCategory ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={showItemDialog} onOpenChange={setShowItemDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleItemSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="item-price">Price *</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 border-input rounded-l-md">
                    {restaurant.default_currency === 'USD' ? '$' : restaurant.default_currency}
                  </span>
                  <Input
                    id="item-price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemForm.price}
                    onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                    placeholder="12.99"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-description">Description</Label>
              <Textarea
                id="item-description"
                value={itemForm.description}
                onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                placeholder="Describe this menu item..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-category">Category</Label>
              <Select
                value={itemForm.category_id}
                onValueChange={(value) => setItemForm({ ...itemForm, category_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="item-special"
                  checked={itemForm.is_special}
                  onCheckedChange={(checked) => setItemForm({ ...itemForm, is_special: checked })}
                />
                <Label htmlFor="item-special">Mark as Special</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="item-available"
                  checked={itemForm.is_available}
                  onCheckedChange={(checked) => setItemForm({ ...itemForm, is_available: checked })}
                />
                <Label htmlFor="item-available">Available</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowItemDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingItem ? 'Update' : 'Create'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
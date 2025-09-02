import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Check, Crown, Lock } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';

interface Currency {
  id: string;
  currency_code: string;
  currency_name: string;
  exchange_rate: number;
  is_default: boolean;
}

interface CurrencyManagementProps {
  restaurantId: string;
}

const availableCurrencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
];

export function CurrencyManagement({ restaurantId }: CurrencyManagementProps) {
  const { toast } = useToast();
  const { subscribed } = useSubscription();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [exchangeRate, setExchangeRate] = useState<string>('1.0');

  useEffect(() => {
    fetchCurrencies();
  }, [restaurantId]);

  const fetchCurrencies = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_currencies')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setCurrencies(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching currencies',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCurrency = async () => {
    if (!selectedCurrency) return;

    // Check subscription limits
    if (!subscribed && currencies.length >= 1) {
      toast({
        title: 'Upgrade Required',
        description: 'Free plan is limited to 1 currency. Upgrade to Premium for unlimited currencies.',
        variant: 'destructive',
      });
      return;
    }

    const selectedCurr = availableCurrencies.find(curr => curr.code === selectedCurrency);
    if (!selectedCurr) return;

    try {
      const { error } = await supabase
        .from('restaurant_currencies')
        .insert({
          restaurant_id: restaurantId,
          currency_code: selectedCurr.code,
          currency_name: selectedCurr.name,
          exchange_rate: parseFloat(exchangeRate) || 1.0,
          is_default: currencies.length === 0,
        });

      if (error) throw error;

      toast({
        title: 'Currency Added',
        description: `${selectedCurr.name} has been added successfully.`,
      });

      setSelectedCurrency('');
      setExchangeRate('1.0');
      fetchCurrencies();
    } catch (error: any) {
      toast({
        title: 'Error adding currency',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeCurrency = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_currencies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Currency Removed',
        description: 'Currency has been removed successfully.',
      });

      fetchCurrencies();
    } catch (error: any) {
      toast({
        title: 'Error removing currency',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const setDefaultCurrency = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('restaurant_currencies')
        .update({ is_default: false })
        .eq('restaurant_id', restaurantId);

      // Then set the new default
      const { error } = await supabase
        .from('restaurant_currencies')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Default Currency Updated',
        description: 'Default currency has been updated successfully.',
      });

      fetchCurrencies();
    } catch (error: any) {
      toast({
        title: 'Error updating default currency',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const updateExchangeRate = async (id: string, newRate: number) => {
    try {
      const { error } = await supabase
        .from('restaurant_currencies')
        .update({ exchange_rate: newRate })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Exchange Rate Updated',
        description: 'Exchange rate has been updated successfully.',
      });

      fetchCurrencies();
    } catch (error: any) {
      toast({
        title: 'Error updating exchange rate',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const availableToAdd = availableCurrencies.filter(
    curr => !currencies.some(existing => existing.currency_code === curr.code)
  );

  if (loading) {
    return <div className="animate-pulse">Loading currencies...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Currencies
          {!subscribed && (
            <Badge variant="outline" className="text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Free: 1 currency
            </Badge>
          )}
          {subscribed && (
            <Badge className="bg-gradient-to-r from-primary to-primary/80">
              <Crown className="w-3 h-3 mr-1" />
              Premium: Unlimited
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Currency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {availableToAdd.map((curr) => (
                <SelectItem key={curr.code} value={curr.code}>
                  {curr.code} - {curr.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div>
            <Input
              type="number"
              step="0.000001"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              placeholder="Exchange rate"
            />
          </div>
          <Button 
            onClick={addCurrency} 
            disabled={!selectedCurrency || (!subscribed && currencies.length >= 1)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Currency List */}
        <div className="space-y-2">
          {currencies.map((currency) => (
            <div
              key={currency.id}
              className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{currency.currency_name}</span>
                <Badge variant="secondary">{currency.currency_code}</Badge>
                <span className="text-sm text-muted-foreground">
                  Rate: {currency.exchange_rate}
                </span>
                {currency.is_default && (
                  <Badge variant="default">
                    <Check className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!currency.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefaultCurrency(currency.id)}
                  >
                    Set Default
                  </Button>
                )}
                {currencies.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeCurrency(currency.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!subscribed && currencies.length >= 1 && (
          <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              <Lock className="w-4 h-4 inline mr-1" />
              Upgrade to Premium to add unlimited currencies and serve global customers
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
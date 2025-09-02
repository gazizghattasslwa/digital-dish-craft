import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Globe, DollarSign } from 'lucide-react';

interface Language {
  language_code: string;
  language_name: string;
}

interface Currency {
  currency_code: string;
  currency_name: string;
  exchange_rate: number;
}

interface LanguageCurrencySelectorProps {
  restaurantSlug: string;
  selectedLanguage: string;
  selectedCurrency: string;
  onLanguageChange: (languageCode: string) => void;
  onCurrencyChange: (currencyCode: string) => void;
}

export function LanguageCurrencySelector({
  restaurantSlug,
  selectedLanguage,
  selectedCurrency,
  onLanguageChange,
  onCurrencyChange,
}: LanguageCurrencySelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantSlug) {
      fetchLanguagesAndCurrencies();
    }
  }, [restaurantSlug]);

  const fetchLanguagesAndCurrencies = async () => {
    try {
      // Get restaurant ID from slug
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('slug', restaurantSlug)
        .single();

      if (restaurantError || !restaurant) return;

      // Fetch languages
      const { data: languagesData, error: languagesError } = await supabase
        .from('restaurant_languages')
        .select('language_code, language_name')
        .eq('restaurant_id', restaurant.id)
        .order('is_default', { ascending: false });

      if (!languagesError) {
        setLanguages(languagesData || []);
      }

      // Fetch currencies
      const { data: currenciesData, error: currenciesError } = await supabase
        .from('restaurant_currencies')
        .select('currency_code, currency_name, exchange_rate')
        .eq('restaurant_id', restaurant.id)
        .order('is_default', { ascending: false });

      if (!currenciesError) {
        setCurrencies(currenciesData || []);
      }
    } catch (error) {
      console.error('Error fetching languages and currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || (languages.length <= 1 && currencies.length <= 1)) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gradient-card rounded-lg border border-border/50 mb-6">
      {languages.length > 1 && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <Label className="text-sm font-medium">Language</Label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.language_code} value={lang.language_code}>
                    {lang.language_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {currencies.length > 1 && (
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <DollarSign className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <Label className="text-sm font-medium">Currency</Label>
            <Select value={selectedCurrency} onValueChange={onCurrencyChange}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.currency_code} value={curr.currency_code}>
                    {curr.currency_code} - {curr.currency_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
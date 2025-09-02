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

interface Language {
  id: string;
  language_code: string;
  language_name: string;
  is_default: boolean;
}

interface LanguageManagementProps {
  restaurantId: string;
}

const availableLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' },
  { code: 'hi', name: 'Hindi' },
];

export function LanguageManagement({ restaurantId }: LanguageManagementProps) {
  const { toast } = useToast();
  const { subscribed } = useSubscription();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');

  useEffect(() => {
    fetchLanguages();
  }, [restaurantId]);

  const fetchLanguages = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant_languages')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('is_default', { ascending: false });

      if (error) throw error;
      setLanguages(data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching languages',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addLanguage = async () => {
    if (!selectedLanguage) return;

    // Check subscription limits
    if (!subscribed && languages.length >= 1) {
      toast({
        title: 'Upgrade Required',
        description: 'Free plan is limited to 1 language. Upgrade to Premium for unlimited languages.',
        variant: 'destructive',
      });
      return;
    }

    const selectedLang = availableLanguages.find(lang => lang.code === selectedLanguage);
    if (!selectedLang) return;

    try {
      const { error } = await supabase
        .from('restaurant_languages')
        .insert({
          restaurant_id: restaurantId,
          language_code: selectedLang.code,
          language_name: selectedLang.name,
          is_default: languages.length === 0,
        });

      if (error) throw error;

      toast({
        title: 'Language Added',
        description: `${selectedLang.name} has been added successfully.`,
      });

      setSelectedLanguage('');
      fetchLanguages();
    } catch (error: any) {
      toast({
        title: 'Error adding language',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const removeLanguage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurant_languages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Language Removed',
        description: 'Language has been removed successfully.',
      });

      fetchLanguages();
    } catch (error: any) {
      toast({
        title: 'Error removing language',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const setDefaultLanguage = async (id: string) => {
    try {
      // First, unset all defaults
      await supabase
        .from('restaurant_languages')
        .update({ is_default: false })
        .eq('restaurant_id', restaurantId);

      // Then set the new default
      const { error } = await supabase
        .from('restaurant_languages')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Default Language Updated',
        description: 'Default language has been updated successfully.',
      });

      fetchLanguages();
    } catch (error: any) {
      toast({
        title: 'Error updating default language',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const availableToAdd = availableLanguages.filter(
    lang => !languages.some(existing => existing.language_code === lang.code)
  );

  if (loading) {
    return <div className="animate-pulse">Loading languages...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Languages
          {!subscribed && (
            <Badge variant="outline" className="text-muted-foreground">
              <Lock className="w-3 h-3 mr-1" />
              Free: 1 language
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
        {/* Add Language */}
        <div className="flex gap-2">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a language to add" />
            </SelectTrigger>
            <SelectContent>
              {availableToAdd.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={addLanguage} 
            disabled={!selectedLanguage || (!subscribed && languages.length >= 1)}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>

        {/* Language List */}
        <div className="space-y-2">
          {languages.map((language) => (
            <div
              key={language.id}
              className="flex items-center justify-between p-3 bg-gradient-card rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{language.language_name}</span>
                <Badge variant="secondary">{language.language_code.toUpperCase()}</Badge>
                {language.is_default && (
                  <Badge variant="default">
                    <Check className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                {!language.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefaultLanguage(language.id)}
                  >
                    Set Default
                  </Button>
                )}
                {languages.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeLanguage(language.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {!subscribed && languages.length >= 1 && (
          <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              <Lock className="w-4 h-4 inline mr-1" />
              Upgrade to Premium to add unlimited languages and improve your international reach
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
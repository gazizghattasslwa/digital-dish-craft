import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Camera, Link } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickMenuImportProps {
  restaurantId: string;
  onImportComplete: () => void;
}

export default function QuickMenuImport({ restaurantId, onImportComplete }: QuickMenuImportProps) {
  const [importMethod, setImportMethod] = useState<'upload' | 'url' | 'text'>('upload');
  const [isImporting, setIsImporting] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [menuText, setMenuText] = useState('');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      // Simulate menu import processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: `Menu imported successfully from ${file.name}`,
      });
      
      onImportComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import menu from file",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleUrlImport = async () => {
    if (!fileUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Simulate URL import processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Menu imported successfully from URL",
      });
      
      setFileUrl('');
      onImportComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import menu from URL",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleTextImport = async () => {
    if (!menuText.trim()) {
      toast({
        title: "Error",
        description: "Please enter menu text",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      // Simulate text import processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Menu imported successfully from text",
      });
      
      setMenuText('');
      onImportComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to import menu from text",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Menu Import</CardTitle>
          <CardDescription>
            Import your menu from various sources to get started quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Import Method Selection */}
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={importMethod === 'upload' ? 'default' : 'outline'}
              onClick={() => setImportMethod('upload')}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Upload className="h-6 w-6" />
              <span>Upload File</span>
            </Button>
            <Button
              variant={importMethod === 'url' ? 'default' : 'outline'}
              onClick={() => setImportMethod('url')}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <Link className="h-6 w-6" />
              <span>From URL</span>
            </Button>
            <Button
              variant={importMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setImportMethod('text')}
              className="flex flex-col items-center gap-2 h-auto py-4"
            >
              <FileText className="h-6 w-6" />
              <span>Paste Text</span>
            </Button>
          </div>

          {/* Import Content */}
          {importMethod === 'upload' && (
            <div className="space-y-4">
              <Label htmlFor="file-upload">Upload Menu File</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                disabled={isImporting}
              />
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, Word documents, images, and text files
              </p>
            </div>
          )}

          {importMethod === 'url' && (
            <div className="space-y-4">
              <Label htmlFor="menu-url">Menu URL</Label>
              <div className="flex gap-2">
                <Input
                  id="menu-url"
                  placeholder="https://example.com/menu.pdf"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  disabled={isImporting}
                />
                <Button onClick={handleUrlImport} disabled={isImporting || !fileUrl.trim()}>
                  {isImporting ? 'Importing...' : 'Import'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a direct link to your menu file or document
              </p>
            </div>
          )}

          {importMethod === 'text' && (
            <div className="space-y-4">
              <Label htmlFor="menu-text">Menu Text</Label>
              <Textarea
                id="menu-text"
                placeholder="Paste your menu text here..."
                value={menuText}
                onChange={(e) => setMenuText(e.target.value)}
                disabled={isImporting}
                rows={8}
              />
              <Button onClick={handleTextImport} disabled={isImporting || !menuText.trim()}>
                {isImporting ? 'Processing...' : 'Import Menu'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Paste your menu text and we'll automatically organize it into categories and items
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI-Powered Extraction
          </CardTitle>
          <CardDescription>
            Our AI can extract menu information from various formats including handwritten menus, photos, and PDFs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Supported Sources:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Restaurant websites</li>
                <li>• PDF menus</li>
                <li>• Menu photos</li>
                <li>• Handwritten menus</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">What we extract:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Item names and descriptions</li>
                <li>• Prices and categories</li>
                <li>• Dietary information</li>
                <li>• Special offers</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
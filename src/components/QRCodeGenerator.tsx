import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Download, QrCode, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  url: string;
  restaurantName: string;
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
}

const QR_STYLES = [
  { id: 'square', name: 'Square', description: 'Classic square dots' },
  { id: 'rounded', name: 'Rounded', description: 'Rounded corner dots' },
  { id: 'circle', name: 'Circle', description: 'Circular dots' },
  { id: 'diamond', name: 'Diamond', description: 'Diamond shaped dots' },
];

const FRAME_STYLES = [
  { id: 'none', name: 'No Frame' },
  { id: 'square', name: 'Square Frame' },
  { id: 'rounded', name: 'Rounded Frame' },
  { id: 'circle', name: 'Circle Frame' },
];

export function QRCodeGenerator({ 
  url, 
  restaurantName, 
  primaryColor, 
  secondaryColor, 
  logoUrl 
}: QRCodeGeneratorProps) {
  const { toast } = useToast();
  
  const [qrConfig, setQrConfig] = useState({
    size: 300,
    style: 'square',
    foregroundColor: primaryColor,
    backgroundColor: '#ffffff',
    logoSize: 80,
    includeLogo: !!logoUrl,
    frameStyle: 'rounded',
    includeFrame: true,
    frameText: `Scan to view ${restaurantName} menu`,
    errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H'
  });

  const generateQRCode = () => {
    // Using QR Server API for generating QR codes
    const qrParams = new URLSearchParams({
      size: `${qrConfig.size}x${qrConfig.size}`,
      data: url,
      color: qrConfig.foregroundColor.replace('#', ''),
      bgcolor: qrConfig.backgroundColor.replace('#', ''),
      ecc: qrConfig.errorCorrectionLevel,
      qzone: '2'
    });

    return `https://api.qrserver.com/v1/create-qr-code/?${qrParams.toString()}`;
  };

  const downloadQRCode = async () => {
    try {
      const qrUrl = generateQRCode();
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${restaurantName.toLowerCase().replace(/\s+/g, '-')}-qr-code.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "QR Code Downloaded",
        description: "Your branded QR code has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* QR Code Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            {qrConfig.includeFrame && (
              <div 
                className={`p-6 ${
                  qrConfig.frameStyle === 'rounded' ? 'rounded-2xl' : 
                  qrConfig.frameStyle === 'circle' ? 'rounded-full' : 
                  qrConfig.frameStyle === 'square' ? 'rounded-none' : ''
                }`}
                style={{ 
                  backgroundColor: qrConfig.backgroundColor,
                  border: qrConfig.frameStyle !== 'none' ? `3px solid ${qrConfig.foregroundColor}` : 'none'
                }}
              >
                <img
                  src={generateQRCode()}
                  alt="QR Code"
                  className="block"
                  style={{ width: qrConfig.size, height: qrConfig.size }}
                />
                {qrConfig.includeLogo && logoUrl && (
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-2"
                    style={{ 
                      width: qrConfig.logoSize, 
                      height: qrConfig.logoSize 
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt="Restaurant Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                {qrConfig.includeFrame && qrConfig.frameText && (
                  <div className="text-center mt-3">
                    <p 
                      className="font-medium text-sm"
                      style={{ color: qrConfig.foregroundColor }}
                    >
                      {qrConfig.frameText}
                    </p>
                  </div>
                )}
              </div>
            )}
            {!qrConfig.includeFrame && (
              <div className="relative">
                <img
                  src={generateQRCode()}
                  alt="QR Code"
                  className="block"
                  style={{ width: qrConfig.size, height: qrConfig.size }}
                />
                {qrConfig.includeLogo && logoUrl && (
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-2"
                    style={{ 
                      width: qrConfig.logoSize, 
                      height: qrConfig.logoSize 
                    }}
                  >
                    <img
                      src={logoUrl}
                      alt="Restaurant Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          <Button onClick={downloadQRCode} className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </CardContent>
      </Card>

      {/* Customization Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Customize QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Size */}
          <div className="space-y-3">
            <Label>Size: {qrConfig.size}px</Label>
            <Slider
              value={[qrConfig.size]}
              onValueChange={(value) => setQrConfig({ ...qrConfig, size: value[0] })}
              min={200}
              max={800}
              step={50}
              className="w-full"
            />
          </div>

          {/* QR Style */}
          <div className="space-y-3">
            <Label>QR Code Style</Label>
            <Select value={qrConfig.style} onValueChange={(value) => setQrConfig({ ...qrConfig, style: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {QR_STYLES.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    <div>
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs text-muted-foreground">{style.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Foreground Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={qrConfig.foregroundColor}
                  onChange={(e) => setQrConfig({ ...qrConfig, foregroundColor: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  value={qrConfig.foregroundColor}
                  onChange={(e) => setQrConfig({ ...qrConfig, foregroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Background Color</Label>
              <div className="flex space-x-2">
                <Input
                  type="color"
                  value={qrConfig.backgroundColor}
                  onChange={(e) => setQrConfig({ ...qrConfig, backgroundColor: e.target.value })}
                  className="w-12 h-10"
                />
                <Input
                  value={qrConfig.backgroundColor}
                  onChange={(e) => setQrConfig({ ...qrConfig, backgroundColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          {/* Logo Options */}
          {logoUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Include Logo</Label>
                <Switch
                  checked={qrConfig.includeLogo}
                  onCheckedChange={(checked) => setQrConfig({ ...qrConfig, includeLogo: checked })}
                />
              </div>
              
              {qrConfig.includeLogo && (
                <div className="space-y-3">
                  <Label>Logo Size: {qrConfig.logoSize}px</Label>
                  <Slider
                    value={[qrConfig.logoSize]}
                    onValueChange={(value) => setQrConfig({ ...qrConfig, logoSize: value[0] })}
                    min={40}
                    max={120}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Frame Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Include Frame</Label>
              <Switch
                checked={qrConfig.includeFrame}
                onCheckedChange={(checked) => setQrConfig({ ...qrConfig, includeFrame: checked })}
              />
            </div>
            
            {qrConfig.includeFrame && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Frame Style</Label>
                  <Select 
                    value={qrConfig.frameStyle} 
                    onValueChange={(value) => setQrConfig({ ...qrConfig, frameStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FRAME_STYLES.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Frame Text</Label>
                  <Input
                    value={qrConfig.frameText}
                    onChange={(e) => setQrConfig({ ...qrConfig, frameText: e.target.value })}
                    placeholder="Enter text for frame"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error Correction */}
          <div className="space-y-2">
            <Label>Error Correction Level</Label>
            <Select 
              value={qrConfig.errorCorrectionLevel} 
              onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setQrConfig({ ...qrConfig, errorCorrectionLevel: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="L">Low (7%)</SelectItem>
                <SelectItem value="M">Medium (15%)</SelectItem>
                <SelectItem value="Q">Quartile (25%)</SelectItem>
                <SelectItem value="H">High (30%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
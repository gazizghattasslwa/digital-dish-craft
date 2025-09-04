import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Palette } from 'lucide-react';

interface QRCodeTabProps {
  url: string;
  restaurantName: string;
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
}

export const QRCodeTab = ({ url, restaurantName, primaryColor, secondaryColor, logoUrl }: QRCodeTabProps) => {
  const [qrConfig, setQrConfig] = useState({
    size: 400,
    primaryColor: primaryColor || '#000000',
    backgroundColor: '#FFFFFF',
    includeLogo: !!logoUrl,
    logoSize: 80,
    includeFrame: true,
    frameText: `Scan for Menu`,
  });

  const qrCodeRef = useRef<HTMLDivElement>(null);

  const generateQRCode = () => {
    const qrCodeUrl = new URL('https://api.qrserver.com/v1/create-qr-code/');
    qrCodeUrl.searchParams.set('size', `${qrConfig.size}x${qrConfig.size}`);
    qrCodeUrl.searchParams.set('data', url);
    qrCodeUrl.searchParams.set('color', qrConfig.primaryColor.substring(1));
    qrCodeUrl.searchParams.set('bgcolor', qrConfig.backgroundColor.substring(1));
    qrCodeUrl.searchParams.set('qzone', '1');
    return qrCodeUrl.toString();
  };

  const downloadQRCode = () => {
    const svgElement = qrCodeRef.current;
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      canvas.width = qrConfig.size;
      canvas.height = qrConfig.size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `${restaurantName}-qr-code.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>QR Code Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div ref={qrCodeRef} className="relative inline-block">
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
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Customize QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
            <div className="space-y-3">
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={qrConfig.primaryColor}
                onChange={(e) => setQrConfig({ ...qrConfig, primaryColor: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label>Background Color</Label>
              <Input
                type="color"
                value={qrConfig.backgroundColor}
                onChange={(e) => setQrConfig({ ...qrConfig, backgroundColor: e.target.value })}
              />
            </div>
            {logoUrl && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeLogo"
                  checked={qrConfig.includeLogo}
                  onCheckedChange={(checked) => setQrConfig({ ...qrConfig, includeLogo: !!checked })}
                />
                <Label htmlFor="includeLogo">Include Logo</Label>
              </div>
            )}
            <Button onClick={downloadQRCode} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
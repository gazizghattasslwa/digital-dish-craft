import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  onGenerate: () => void;
}

export const QRCodeGenerator = ({ onGenerate }: QRCodeGeneratorProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={onGenerate}
      className="transition-base"
    >
      <QrCode className="w-4 h-4 mr-2" />
      Generate QR Code
    </Button>
  );
};
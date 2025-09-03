import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = "Search...", className }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`pl-10 pr-10 h-10 bg-background border-border focus:border-primary focus:ring-1 focus:ring-primary ${
          isFocused ? 'border-primary' : ''
        }`}
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onChange('')}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
        >
          <X className="w-3 h-3 text-muted-foreground hover:text-foreground" />
        </Button>
      )}
    </div>
  );
}
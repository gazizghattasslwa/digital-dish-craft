import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Globe, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Copy, 
  Eye,
  Settings,
  Zap,
  Shield,
  ArrowRight,
  Info
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CustomDomainManagementProps {
  restaurantId: string;
  restaurantName: string;
  restaurantSlug: string;
}

interface DomainRecord {
  id: string;
  domain: string;
  status: 'pending' | 'active' | 'failed';
  ssl_status: 'pending' | 'active' | 'failed';
  created_at: string;
}

export function CustomDomainManagement({ restaurantId, restaurantName, restaurantSlug }: CustomDomainManagementProps) {
  const [customDomain, setCustomDomain] = useState('');
  const [domainRecords, setDomainRecords] = useState<DomainRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('setup');

  useEffect(() => {
    fetchDomainRecords();
  }, [restaurantId]);

  const fetchDomainRecords = async () => {
    try {
      // For now, use mock data until custom_domains table types are available
      const mockDomains: DomainRecord[] = [];
      setDomainRecords(mockDomains);
    } catch (error: any) {
      console.error('Error fetching domain records:', error);
    }
  };

  const handleSaveDomain = async () => {
    if (!customDomain.trim()) {
      toast.error('Please enter a domain name');
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(customDomain)) {
      toast.error('Please enter a valid domain name (e.g., menu.yourrestaurant.com)');
      return;
    }

    setLoading(true);
    try {
      // For now, simulate adding domain until custom_domains table types are available
      const newDomainRecord: DomainRecord = {
        id: Date.now().toString(),
        domain: customDomain.toLowerCase().trim(),
        status: 'pending',
        ssl_status: 'pending',
        created_at: new Date().toISOString()
      };
      
      setDomainRecords([newDomainRecord, ...domainRecords]);
      setCustomDomain('');
      setActiveTab('manage');
      
      toast.success('Domain added! Follow the setup instructions to complete the configuration.');
    } catch (error: any) {
      toast.error('Error adding domain');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    try {
      // For now, simulate deletion until custom_domains table types are available
      setDomainRecords(domainRecords.filter(d => d.id !== domainId));
      toast.success('Domain removed successfully');
    } catch (error: any) {
      toast.error('Error removing domain');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'status-inactive';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Check className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'failed': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Custom Domain</h2>
        <p className="text-muted-foreground">
          Connect your own domain to create a professional branded menu experience
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="setup" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Setup
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Manage
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <Card className="clean-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                Add Custom Domain
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain">Domain Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="domain"
                    placeholder="menu.yourrestaurant.com"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveDomain}
                    disabled={loading || !customDomain.trim()}
                    className="btn-clean"
                  >
                    {loading ? 'Adding...' : 'Add Domain'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the domain or subdomain you want to use for your menu (e.g., menu.yourrestaurant.com)
                </p>
              </div>

              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Don't have a domain?</strong> You can purchase one from providers like:
                  <div className="mt-2 flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://domains.google" target="_blank" rel="noopener noreferrer">
                        Google Domains <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.namecheap.com" target="_blank" rel="noopener noreferrer">
                        Namecheap <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://www.godaddy.com" target="_blank" rel="noopener noreferrer">
                        GoDaddy <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card className="clean-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                DNS Setup Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Step 1: Add DNS Records</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Add these DNS records at your domain provider:
                  </p>
                  
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">A Record</div>
                        <div className="text-xs text-muted-foreground">
                          Name: @ (or your subdomain)
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Value: 185.158.133.1
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard('185.158.133.1')}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 2: Wait for Propagation</h4>
                  <p className="text-sm text-muted-foreground">
                    DNS changes can take up to 24-48 hours to propagate worldwide.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Step 3: SSL Certificate</h4>
                  <p className="text-sm text-muted-foreground">
                    Once DNS is configured, SSL certificates will be automatically provisioned for secure HTTPS access.
                  </p>
                </div>
              </div>

              <Alert>
                <Shield className="w-4 h-4" />
                <AlertDescription>
                  <strong>Need help?</strong> Contact your domain provider's support if you need assistance configuring DNS records.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {domainRecords.length === 0 ? (
            <Card className="clean-card">
              <CardContent className="text-center py-12">
                <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Custom Domains</h3>
                <p className="text-muted-foreground mb-4">
                  Add a custom domain to get started with your branded menu URL.
                </p>
                <Button onClick={() => setActiveTab('setup')} className="btn-clean">
                  Add Custom Domain
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {domainRecords.map((domain) => (
                <Card key={domain.id} className="clean-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{domain.domain}</h3>
                          <Badge className={getStatusColor(domain.status)}>
                            {getStatusIcon(domain.status)}
                            {domain.status}
                          </Badge>
                          {domain.ssl_status === 'active' && (
                            <Badge className="status-active">
                              <Shield className="w-3 h-3 mr-1" />
                              SSL Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Added {new Date(domain.created_at).toLocaleDateString()}
                        </p>
                        {domain.status === 'active' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a 
                                href={`https://${domain.domain}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Visit Site
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {domain.status === 'pending' && (
                          <div className="text-sm text-muted-foreground">
                            Waiting for DNS...
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDomain(domain.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="clean-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Domain Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Current Menu URL</h4>
                  <div className="bg-muted p-3 rounded-lg">
                    <code className="text-sm">
                      {window.location.origin}/menu/{restaurantSlug}
                    </code>
                  </div>
                </div>

                {domainRecords.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Custom Domain URLs</h4>
                    <div className="space-y-2">
                      {domainRecords.map((domain) => (
                        <div key={domain.id} className="bg-muted p-3 rounded-lg flex items-center justify-between">
                          <code className="text-sm">
                            https://{domain.domain}
                          </code>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(domain.status)}>
                              {domain.status}
                            </Badge>
                            {domain.status === 'active' && (
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a 
                                  href={`https://${domain.domain}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold mb-3">Benefits of Custom Domains</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">Professional Branding</h5>
                      <p className="text-sm text-muted-foreground">
                        Use your own domain for a professional appearance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h5 className="font-medium">SSL Security</h5>
                      <p className="text-sm text-muted-foreground">
                        Automatic HTTPS encryption for secure browsing
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-foreground" />
                    </div>
                    <div>
                      <h5 className="font-medium">Easy to Remember</h5>
                      <p className="text-sm text-muted-foreground">
                        Memorable URLs that customers can easily share
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-medium">SEO Benefits</h5>
                      <p className="text-sm text-muted-foreground">
                        Better search engine optimization with your own domain
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
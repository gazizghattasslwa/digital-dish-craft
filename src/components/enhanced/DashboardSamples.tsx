
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, QrCode, Smartphone } from "lucide-react";

export const DashboardSamples = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-fluid">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">Live Demo & Dashboard Previews</h2>
          <p className="text-md sm:text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Experience the power of MenuCraft with these interactive samples.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-primary" />
                    QR Code
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center">
                        <img src="/placeholder.svg" alt="QR Code" className="w-48 h-48" />
                    </div>
                    <Button className="w-full mt-4 btn-primary">Download QR Code</Button>
                </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <Card className="shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-primary" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video">
                  <img src="/placeholder.svg" alt="Analytics Chart" className="w-full h-full object-cover rounded-lg" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-primary" />
                        Mobile Preview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative h-[400px] sm:h-[600px] w-full max-w-lg mx-auto bg-gray-100 rounded-lg p-2 sm:p-4">
                            <div className="h-full w-full bg-white rounded-lg shadow-inner overflow-y-auto">
                                <div className="p-4">
                                <h3 className="text-xl sm:text-2xl font-bold text-center mb-4">The Gourmet Place</h3>
                                <div>
                                    <h4 className="text-lg sm:text-xl font-semibold mt-4 border-b pb-2">Appetizers</h4>
                                    <div className="flex justify-between py-2 text-sm sm:text-base">
                                    <span>Bruschetta</span>
                                    <span>$12</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-sm sm:text-base">
                                    <span>Calamari</span>
                                    <span>$15</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg sm:text-xl font-semibold mt-4 border-b pb-2">Main Courses</h4>
                                    <div className="flex justify-between py-2 text-sm sm:text-base">
                                    <span>Spaghetti Carbonara</span>
                                    <span>$22</span>
                                    </div>
                                    <div className="flex justify-between py-2 text-sm sm:text-base">
                                    <span>Ribeye Steak</span>
                                    <span>$35</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </section>
  );
};

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Home, DollarSign, TrendingUp, Users } from "lucide-react";
import LineChart from "@/components/charts/line-chart";
import { ModeToggle } from "@/components/ui/toggle";

export default function RealEstateDashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* this is the search bar */}
      <header className="sticky top-0 z-10 bg-background border-b flex flex-row items-center justify-center">
        <div className=" px-4 py-4">
          <Input
            type="search"
            placeholder="Search properties..."
            className="max-w-md mx-auto"
          />
        </div>
        <ModeToggle />
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Property Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Property map"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />

                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-red-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <Card key={item}>
                      <CardContent className="p-4">
                        <div className="aspect-video relative mb-2">
                          <Image
                            src={`/placeholder.svg?height=200&width=300&text=Property ${item}`}
                            alt={`Property ${item}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                        <h3 className="font-semibold">Beautiful Home {item}</h3>
                        <p className="text-sm text-muted-foreground">
                          123 Main St, City
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold">$499,000</span>
                          <Badge>For Sale</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-[14px]">
            <Card>
              <CardHeader>
                <CardTitle>Our Suggestion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto font-bold">
                  Buy this property{" "}
                </div>
                <div>Why we say that?</div>
                <div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Reprehenderit animi accusamus iste excepturi dolor error natus
                  culpa aspernatur iure quo. Animi facilis cumque officiis
                  voluptate in sit nostrum dignissimos similique?
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Real Estate Insights</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row">
                <ul className="space-y-4 flex flex-row">
                  <li className="flex items-center space-x-2">
                    <Home className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Total Listings</h3>
                      <p className="text-2xl">1,234</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <DollarSign className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Average Price</h3>
                      <p className="text-2xl">$450,000</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <TrendingUp className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Market Trend</h3>
                      <p className="text-2xl">+5.2% this month</p>
                    </div>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Users className="text-primary" />
                    <div>
                      <h3 className="font-semibold">Active Buyers</h3>
                      <p className="text-2xl">567</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <LineChart />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

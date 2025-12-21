import { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { listingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  rating?: number;
}

const Index = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [searchQuery, listings]);

  const fetchListings = async () => {
    try {
      const response = await listingsAPI.getAll();
      setListings(response.data);
      setFilteredListings(response.data);
    } catch (error) {
      // Using mock data for demo when backend is not available
      const mockListings: Listing[] = [
        {
          _id: '1',
          title: 'Cozy Mountain Retreat',
          description: 'Beautiful cabin in the mountains',
          price: 4500,
          location: 'Shimla, Himachal Pradesh',
          rating: 4.95,
        },
        {
          _id: '2',
          title: 'Beachfront Paradise',
          description: 'Wake up to ocean views',
          price: 7200,
          location: 'Goa, India',
          rating: 4.88,
        },
        {
          _id: '3',
          title: 'Modern City Apartment',
          description: 'In the heart of the city',
          price: 3800,
          location: 'Mumbai, Maharashtra',
          rating: 4.72,
        },
        {
          _id: '4',
          title: 'Heritage Haveli',
          description: 'Traditional Rajasthani experience',
          price: 5500,
          location: 'Jaipur, Rajasthan',
          rating: 4.91,
        },
        {
          _id: '5',
          title: 'Lake View Villa',
          description: 'Serene lakeside living',
          price: 6800,
          location: 'Udaipur, Rajasthan',
          rating: 4.85,
        },
        {
          _id: '6',
          title: 'Tea Estate Bungalow',
          description: 'Colonial charm in the hills',
          price: 8500,
          location: 'Munnar, Kerala',
          rating: 4.97,
        },
      ];
      setListings(mockListings);
      setFilteredListings(mockListings);
      toast({
        title: "Demo Mode",
        description: "Showing sample listings. Connect your backend to see real data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Search Section */}
      <section className="border-b bg-background py-4">
        <div className="container">
          <div className="mx-auto flex max-w-2xl items-center gap-2 rounded-full border bg-card p-2 shadow-sm">
            <div className="flex flex-1 items-center gap-2 px-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent p-0 focus-visible:ring-0"
              />
            </div>
            <Button size="icon" className="h-10 w-10 rounded-full">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <main className="container py-8">
        <h2 className="mb-6 text-2xl font-semibold">
          {searchQuery ? `Results for "${searchQuery}"` : 'Popular homes'}
        </h2>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-muted" />
                <div className="mt-3 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-1/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredListings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing._id}
                id={listing._id}
                title={listing.title}
                location={listing.location}
                price={listing.price}
                image={listing.image}
                rating={listing.rating}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No listings found for "{searchQuery}"
            </p>
            <Button
              variant="link"
              onClick={() => setSearchQuery('')}
              className="mt-2"
            >
              Clear search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

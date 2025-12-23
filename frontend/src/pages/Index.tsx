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
          image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800',
        },
        {
          _id: '2',
          title: 'Beachfront Paradise',
          description: 'Wake up to ocean views',
          price: 7200,
          location: 'Goa, India',
          rating: 4.88,
          image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',
        },
        {
          _id: '3',
          title: 'Modern City Apartment',
          description: 'In the heart of the city',
          price: 3800,
          location: 'Mumbai, Maharashtra',
          rating: 4.72,
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        },
        {
          _id: '4',
          title: 'Heritage Haveli',
          description: 'Traditional Rajasthani experience',
          price: 5500,
          location: 'Jaipur, Rajasthan',
          rating: 4.91,
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
        },
        {
          _id: '5',
          title: 'Lake View Villa',
          description: 'Serene lakeside living',
          price: 6800,
          location: 'Udaipur, Rajasthan',
          rating: 4.85,
          image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
        },
        {
          _id: '6',
          title: 'Tea Estate Bungalow',
          description: 'Colonial charm in the hills',
          price: 8500,
          location: 'Munnar, Kerala',
          rating: 4.97,
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        },
        {
          _id: '7',
          title: 'Himalayan Wooden Cottage',
          description: 'Peaceful getaway with mountain views',
          price: 5200,
          location: 'Manali, Himachal Pradesh',
          rating: 4.89,
          image: 'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800',
        },
        {
          _id: '8',
          title: 'Backwater Houseboat',
          description: 'Unique floating experience',
          price: 9500,
          location: 'Alleppey, Kerala',
          rating: 4.93,
          image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800',
        },
        {
          _id: '9',
          title: 'Desert Camp Luxury',
          description: 'Under the stars in Thar',
          price: 6200,
          location: 'Jaisalmer, Rajasthan',
          rating: 4.78,
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        },
        {
          _id: '10',
          title: 'Treehouse Retreat',
          description: 'Live among the treetops',
          price: 7800,
          location: 'Wayanad, Kerala',
          rating: 4.96,
          image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
        },
        {
          _id: '11',
          title: 'Riverside Cottage',
          description: 'Peaceful riverside escape',
          price: 4200,
          location: 'Rishikesh, Uttarakhand',
          rating: 4.82,
          image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800',
        },
        {
          _id: '12',
          title: 'Colonial Bungalow',
          description: 'Historic charm with modern comfort',
          price: 6500,
          location: 'Ooty, Tamil Nadu',
          rating: 4.87,
          image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800',
        },
        {
          _id: '13',
          title: 'Cliff Edge Villa',
          description: 'Stunning ocean cliff views',
          price: 11000,
          location: 'Varkala, Kerala',
          rating: 4.94,
          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
        },
        {
          _id: '14',
          title: 'Forest Log Cabin',
          description: 'Surrounded by pine forests',
          price: 4800,
          location: 'Kasol, Himachal Pradesh',
          rating: 4.79,
          image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800',
        },
        {
          _id: '15',
          title: 'Palace Suite',
          description: 'Royal living experience',
          price: 15000,
          location: 'Jodhpur, Rajasthan',
          rating: 4.99,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
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

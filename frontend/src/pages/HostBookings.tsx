import { useState, useEffect } from 'react';
import { Loader2, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BookingCard from '@/components/BookingCard';
import { bookingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  _id: string;
  listing: {
    _id: string;
    title: string;
    location: string;
    image?: string;
  };
  guest: {
    _id: string;
    name: string;
  };
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

const HostBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getHostBookings();
      setBookings(response.data);
    } catch (error) {
      // Mock data for demo
      setBookings([
        {
          _id: 'hb1',
          listing: {
            _id: 'l1',
            title: 'Modern City Apartment',
            location: 'Mumbai, Maharashtra',
          },
          guest: { _id: 'g1', name: 'Rahul Kumar' },
          checkIn: '2024-12-20',
          checkOut: '2024-12-23',
          totalPrice: 11400,
          status: 'confirmed',
        },
        {
          _id: 'hb2',
          listing: {
            _id: 'l1',
            title: 'Modern City Apartment',
            location: 'Mumbai, Maharashtra',
          },
          guest: { _id: 'g2', name: 'Priya Singh' },
          checkIn: '2024-12-28',
          checkOut: '2025-01-02',
          totalPrice: 19000,
          status: 'confirmed',
        },
      ]);
      toast({
        title: "Demo Mode",
        description: "Showing sample host bookings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="mb-6 flex items-center gap-3">
          <Home className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Host Bookings</h1>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                listingTitle={booking.listing.title}
                listingLocation={booking.listing.location}
                listingImage={booking.listing.image}
                checkIn={booking.checkIn}
                checkOut={booking.checkOut}
                totalPrice={booking.totalPrice}
                status={booking.status}
                guestName={booking.guest.name}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <Home className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No bookings for your listings</h2>
            <p className="mt-1 text-muted-foreground">
              When guests book your properties, they'll appear here
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default HostBookings;

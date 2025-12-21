import { useState, useEffect } from 'react';
import { Loader2, Calendar } from 'lucide-react';
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
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: string;
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      // Mock data for demo
      setBookings([
        {
          _id: 'b1',
          listing: {
            _id: 'l1',
            title: 'Cozy Mountain Retreat',
            location: 'Shimla, Himachal Pradesh',
          },
          checkIn: '2024-12-25',
          checkOut: '2024-12-28',
          totalPrice: 13500,
          status: 'confirmed',
        },
        {
          _id: 'b2',
          listing: {
            _id: 'l2',
            title: 'Beachfront Paradise',
            location: 'Goa, India',
          },
          checkIn: '2025-01-10',
          checkOut: '2025-01-15',
          totalPrice: 36000,
          status: 'confirmed',
        },
      ]);
      toast({
        title: "Demo Mode",
        description: "Showing sample bookings.",
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
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">My Bookings</h1>
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
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed py-16 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No bookings yet</h2>
            <p className="mt-1 text-muted-foreground">
              When you book a stay, it will appear here
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyBookings;

import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookingCardProps {
  listingTitle: string;
  listingLocation: string;
  listingImage?: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status?: string;
  guestName?: string;
}

const BookingCard = ({
  listingTitle,
  listingLocation,
  listingImage,
  checkIn,
  checkOut,
  totalPrice,
  status = 'confirmed',
  guestName,
}: BookingCardProps) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="aspect-video sm:aspect-square sm:w-40">
            <img
              src={listingImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&auto=format&fit=crop&q=60'}
              alt={listingTitle}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold">{listingTitle}</h3>
                <Badge
                  variant={status === 'confirmed' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {status}
                </Badge>
              </div>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>{listingLocation}</span>
              </div>
              {guestName && (
                <p className="mt-2 text-sm">
                  Guest: <span className="font-medium">{guestName}</span>
                </p>
              )}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {formatDate(checkIn)} — {formatDate(checkOut)}
                </span>
              </div>
              <p className="font-semibold">₹{totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;

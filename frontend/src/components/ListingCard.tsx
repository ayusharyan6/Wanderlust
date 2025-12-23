import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  image?: string;
  rating?: number;
}

const ListingCard = ({ id, title, location, price, image, rating }: ListingCardProps) => {
  return (
    <Link to={`/listings/${id}`}>
      <Card className="group overflow-hidden border-0 shadow-none transition-transform hover:scale-[1.02]">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <img
              src={image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60'}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {rating && rating >= 4.8 && (
              <div className="absolute left-3 top-3 rounded-full bg-background px-2.5 py-1 text-xs font-medium">
                Guest favourite
              </div>
            )}
          </div>
          <div className="space-y-1 pt-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
              {rating && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-foreground" />
                  <span>{rating.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-sm line-clamp-1">{location}</span>
            </div>
            <p className="pt-1 text-sm">
              <span className="font-semibold">₹{price.toLocaleString()}</span>
              <span className="text-muted-foreground"> / night</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Calendar, User, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { listingsAPI, reviewsAPI, bookingsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  image?: string;
  host?: { _id: string; name: string };
}

interface Review {
  _id: string;
  user: { _id: string; name: string };
  rating: number;
  comment: string;
  createdAt: string;
}

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Booking state
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Review state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
      fetchReviews();
    }
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await listingsAPI.getById(id!);
      setListing(response.data);
    } catch (error) {
      // Mock data for demo
      setListing({
        _id: id!,
        title: 'Beautiful Mountain Retreat',
        description: 'Escape to this stunning mountain cabin with breathtaking views. Perfect for couples or solo travelers seeking peace and tranquility. Features a cozy fireplace, fully equipped kitchen, and private deck overlooking the valley. Hiking trails nearby.',
        price: 5500,
        location: 'Manali, Himachal Pradesh',
        host: { _id: 'host1', name: 'Priya Sharma' },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByListing(id!);
      setReviews(response.data);
    } catch (error) {
      // Mock reviews
      setReviews([
        {
          _id: 'r1',
          user: { _id: 'u1', name: 'Rahul Kumar' },
          rating: 5,
          comment: 'Amazing place! The views were incredible and the host was very responsive. Would definitely come back.',
          createdAt: '2024-12-01',
        },
        {
          _id: 'r2',
          user: { _id: 'u2', name: 'Anjali Patel' },
          rating: 4,
          comment: 'Great location and very clean. Only wish the WiFi was a bit faster, but overall a wonderful stay.',
          createdAt: '2024-11-15',
        },
      ]);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }

    if (!checkIn || !checkOut) {
      toast({ title: 'Please select dates', variant: 'destructive' });
      return;
    }

    setIsBooking(true);
    try {
      await bookingsAPI.create({ listingId: id!, checkIn, checkOut });
      toast({ title: 'Booking confirmed!', description: 'Check your bookings page for details.' });
      setCheckIn('');
      setCheckOut('');
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/listings/${id}` } } });
      return;
    }

    if (!comment.trim()) {
      toast({ title: 'Please write a review', variant: 'destructive' });
      return;
    }

    setIsSubmittingReview(true);
    try {
      await reviewsAPI.create(id!, { rating, comment });
      toast({ title: 'Review submitted!' });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (error: any) {
      toast({
        title: 'Failed to submit review',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsAPI.delete(id!, reviewId);
      toast({ title: 'Review deleted' });
      setReviews(reviews.filter((r) => r._id !== reviewId));
    } catch (error) {
      toast({ title: 'Failed to delete review', variant: 'destructive' });
    }
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = calculateNights();
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-semibold">Listing not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="aspect-video overflow-hidden rounded-xl">
              <img
                src={listing.image || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&auto=format&fit=crop&q=80'}
                alt={listing.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Title & Info */}
            <div className="mt-6">
              <h1 className="text-2xl font-bold sm:text-3xl">{listing.title}</h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{listing.location}</span>
                </div>
                {avgRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-foreground text-foreground" />
                    <span>{avgRating}</span>
                    <span>({reviews.length} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Host */}
            {listing.host && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Hosted by {listing.host.name}</p>
                    <p className="text-sm text-muted-foreground">Superhost</p>
                  </div>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold">About this place</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{listing.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Reviews Section */}
            <div>
              <h2 className="text-lg font-semibold">
                Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>

              {/* Add Review Form */}
              {isAuthenticated && listing.host?._id !== user?.id && (
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
                  <div>
                    <Label>Rating</Label>
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              value <= rating
                                ? 'fill-foreground text-foreground'
                                : 'text-muted'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="comment">Your review</Label>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" disabled={isSubmittingReview}>
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </Button>
                </form>
              )}

              {/* Reviews List */}
              <div className="mt-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      id={review._id}
                      userId={review.user._id}
                      userName={review.user.name}
                      rating={review.rating}
                      comment={review.comment}
                      createdAt={review.createdAt}
                      onDelete={handleDeleteReview}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-baseline gap-1">
                  <span className="text-2xl">₹{listing.price.toLocaleString()}</span>
                  <span className="text-base font-normal text-muted-foreground">/ night</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="checkin">Check-in</Label>
                      <Input
                        id="checkin"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout">Check-out</Label>
                      <Input
                        id="checkout"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split('T')[0]}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isBooking}>
                    {isBooking ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Reserve'
                    )}
                  </Button>

                  {nights > 0 && (
                    <div className="space-y-2 pt-4 text-sm">
                      <div className="flex justify-between">
                        <span>
                          ₹{listing.price.toLocaleString()} × {nights} nights
                        </span>
                        <span>₹{(listing.price * nights).toLocaleString()}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{(listing.price * nights).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetails;

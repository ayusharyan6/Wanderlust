import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { listingsAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  price: z.number().min(100, 'Price must be at least ₹100'),
  location: z.string().min(3, 'Location is required').max(200),
  image: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

const CreateListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      title,
      description,
      price: parseFloat(price) || 0,
      location,
      image: image || undefined,
    };

    const result = listingSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await listingsAPI.create(data);
      toast({ title: 'Listing created successfully!' });
      navigate(`/listings/${response.data._id}`);
    } catch (error: any) {
      toast({
        title: 'Failed to create listing',
        description: error.response?.data?.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Listing</CardTitle>
            <CardDescription>
              Share your space with travelers from around the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Cozy apartment in the heart of the city"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your place, amenities, and what makes it special..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per night (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Mumbai, Maharashtra"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">{errors.location}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  disabled={isSubmitting}
                />
                {errors.image && (
                  <p className="text-sm text-destructive">{errors.image}</p>
                )}
                {image && (
                  <div className="mt-2 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Listing'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateListing;

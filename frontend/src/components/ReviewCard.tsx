import { Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  onDelete?: (reviewId: string) => void;
}

const ReviewCard = ({
  id,
  userId,
  userName,
  rating,
  comment,
  createdAt,
  onDelete,
}: ReviewCardProps) => {
  const { user } = useAuth();
  const isOwner = user?.id === userId;

  return (
    <div className="border-b py-4 last:border-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < rating ? 'fill-foreground text-foreground' : 'text-muted'
                }`}
              />
            ))}
          </div>
          {isOwner && onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{comment}</p>
    </div>
  );
};

export default ReviewCard;

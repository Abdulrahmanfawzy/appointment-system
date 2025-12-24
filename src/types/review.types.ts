
export interface Review {
  id: number;
  name: string;
  timeAgo: string;
  rating: number;
  avatar: string;
  review: string;
}

export interface ReviewsStats {
  averageRating: number;
  totalReviews: number;
}
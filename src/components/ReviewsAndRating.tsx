import React, { useState } from 'react';
import { Star, Edit2 } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  timeAgo: string;
  rating: number;
  avatar: string;
  review: string;
}

const ReviewsAndRating: React.FC = () => {
  const [reviews] = useState<Review[]>([
    {
      id: 1,
      name: "Noble Reyes",
      timeAgo: "2 weeks ago",
      rating: 4,
      avatar: "https://i.pravatar.cc/150?img=12",
      review: "Dr. Turner's clinic is very modern and well-equipped. The service I received was very attentive and thorough. The clinic was clean, and the staff were friendly. Highly recommend!"
    },
    {
      id: 2,
      name: "Ferne Edwart A",
      timeAgo: "4 weeks ago",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?img=5",
      review: "I had an excellent experience at this clinic. Dr. Turner was professional, and the staff made me feel comfortable. Highly recommend!"
    }
  ]);

  const totalReviews = 1250;
  const averageRating = 4.5;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Reviews and Rating
        </h2>
        <button 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span className="text-sm font-medium">Add review</span>
        </button>
      </div>

      {/* Rating Summary */}
      <div className="flex items-center gap-8 mb-8 pb-6 border-b border-gray-200">
        <div className="flex flex-col items-center">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {averageRating}/5
          </div>
          <div className="flex gap-1 mb-2">
            {renderStars(Math.floor(averageRating))}
          </div>
          <div className="text-sm text-gray-500">
            {totalReviews.toLocaleString()} Reviews
          </div>
        </div>

        <div className="flex-1">
          <div className="flex gap-1 justify-end">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-8 h-8 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Avatar */}
            <div className="flex-shrink-0">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Review Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.name}
                  </h3>
                  <p className="text-sm text-gray-500">{review.timeAgo}</p>
                </div>
                <div>{renderStars(review.rating)}</div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.review}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="mt-8 text-center">
        <button 
          className="px-6 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium"
        >
          Load more reviews
        </button>
      </div>
    </div>
  );
};

export default ReviewsAndRating;

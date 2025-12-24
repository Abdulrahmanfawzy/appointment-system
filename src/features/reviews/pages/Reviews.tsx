import ReviewsAndRating from "@/components/ReviewsAndRating";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <ReviewsAndRating />
    </div>
  );
};

export default Reviews;

// Then in AppRoutes.tsx:



// ============================================
// NAVIGATION LINK EXAMPLE
// ============================================
// Add to your navigation component
import { Link } from "react-router-dom";

<Link to="/reviews" className="nav-link">
  Reviews
</Link>
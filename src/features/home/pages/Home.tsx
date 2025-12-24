import ReviewsAndRating from "@/components/ReviewsAndRating";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your existing home content */}
      
      {/* Add Reviews Section */}
      <section className="py-12">
        <ReviewsAndRating />
      </section>
      
      {/* Your other sections */}
    </div>
  );
};

export default Home;

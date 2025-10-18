import TopBar from '@/app/dashboardComponents/TopBar';
import ReviewsPageContent from './ReviewsPageContent';

const ReviewsPage = () => {
  return (
    <div className="mt-8">
      <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Reviews" />
        <ReviewsPageContent />
      </section>
    </div>
  );
};

export default ReviewsPage;

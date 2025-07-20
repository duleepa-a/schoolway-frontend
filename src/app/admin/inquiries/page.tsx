import TopBar from '@/app/dashboardComponents/TopBar';
import InquiriesPageContent from './InquiriesPageContent';

const InquiriesPage = () => {

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading="Inquiries" />
        <InquiriesPageContent/>

      </section>
    </div>
  );
};

export default InquiriesPage;

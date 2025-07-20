import TopBar from '@/app/dashboardComponents/TopBar';
import PaymentsPageContent from './PaymentsPageContent';

const Payments = () => {

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading="Payment History" />
        <PaymentsPageContent/>

      </section>
    </div>
  );
};

export default Payments;

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import TopBar from "@/app/dashboardComponents/TopBar";
import ContactUsPageContent from "./ContactUsPageContent";
import "../dashboards.css";

const ContactUsPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        {/* Show TopBar only for logged-in users */}
        {session?.user && <TopBar heading="Contact Us" />}
        <ContactUsPageContent />
      </section>
    </div>
  );
};

export default ContactUsPage;

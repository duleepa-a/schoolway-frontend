import TopBar from '@/app/dashboardComponents/TopBar';
import TabContentLayout from './components/TabContentLayout';

const ManageSchoolsPage = () => {

  return (
      <div>
        <section className="p-5 md:p-10 min-h-screen w-full">
          {/*Top bar with profile icon and the heading*/}
          <TopBar heading="Manage Schools" />
          <TabContentLayout/>
          
        </section>
      </div>
  )
}



export default ManageSchoolsPage;
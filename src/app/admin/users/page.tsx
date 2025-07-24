import TopBar from '@/app/dashboardComponents/TopBar';
import AdminUsersPage from './AdminUsersPage';

const AdminDashboard = () => { 

  return (

      <div className="mt-8">
        <section className="p-5 md:p-10 min-h-screen w-full">
        
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Users" />
        <AdminUsersPage/>

        </section>
      </div>
  )
}

export default AdminDashboard

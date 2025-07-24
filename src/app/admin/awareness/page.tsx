import TopBar from '@/app/dashboardComponents/TopBar';
import PostForm from '@/app/dashboardComponents/PostAwrSessionForm';

const AdminDashboard = () => {

  return (

      <section className="p-4 md:p-8 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading= "Awareness Sessions" />     

        {/* <UserFilterBar />   */}

        <div className="p-5">
          <h1 className="text-xl font-semibold mb-4">Create a new Post</h1>
          <PostForm />
        </div>

      
    </section>
  )
}

export default AdminDashboard

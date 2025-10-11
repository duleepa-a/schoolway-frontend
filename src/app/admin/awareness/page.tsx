
import TopBar from '@/app/dashboardComponents/TopBar';
import PostForm from '@/app/dashboardComponents/PostAwrSessionForm';
import AwarenessPost from './AwarenessPost';
import sessiomImg from '../../../../public/Images/session_img.jpg';

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

              <h1 className="text-xl font-semibold mb-4">Latest Awareness Post</h1>

        {/* Awareness Post Card Example */}
        <div className="p-5 grid grid-cols-3 gap-5">
          <AwarenessPost
            title="School Safety Awareness"
            content="Join us for a session on school safety, emergency procedures, and best practices to keep our students safe. All parents and staff are welcome!"
            imageUrl={sessiomImg.src}
          />
          <AwarenessPost
            title="School Safety Awareness"
            content="Join us for a session on school safety, emergency procedures, and best practices to keep our students safe. All parents and staff are welcome!"
            imageUrl={sessiomImg.src}
          />
          <AwarenessPost
            title="School Safety Awareness"
            content="Join us for a session on school safety, emergency procedures, and best practices to keep our students safe. All parents and staff are welcome!"
            imageUrl={sessiomImg.src}
          />
        </div>

      
    </section>
  )
}

export default AdminDashboard

import React , {ReactNode} from 'react' 
import Sidebar from './SideBar';
import "../dashboards.css";

interface Props {
    children : ReactNode;
 }

 const VanOwnerLayout = ( {children}:Props) => {
   return (
     <div className='h-screen w-full flex overflow-hidden'>
        <div className='h-screen sticky top-0 left-0 z-20'>
          <Sidebar/>
        </div>
        <main className='flex-1 h-screen overflow-y-auto'>
            {children}
        </main>
     </div>
   )
 }
 
 export default VanOwnerLayout
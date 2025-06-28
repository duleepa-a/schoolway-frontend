import React , {ReactNode} from 'react' 
import Sidebar from './SideBar';

interface Props {
    children : ReactNode;
 }

 const VanOwnerLayout = ( {children}:Props) => {
   return (
     <div className='h-screen w-full flex '>
        <Sidebar/>
        <main className='flex-1'>
            {children}
        </main>
     </div>
   )
 }
 
 export default VanOwnerLayout
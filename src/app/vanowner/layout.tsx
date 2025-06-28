import React , {ReactNode} from 'react' 
import Sidebar from './SideBar';

interface Props {
    children : ReactNode;
 }

 const VanOwnerLayout = ( {children}:Props) => {
   return (
     <div className='h-screen w-full flex '>
        <Sidebar/>
        <div>
            {children}
        </div>
     </div>
   )
 }
 
 export default VanOwnerLayout
import React , {ReactNode} from 'react'
import Navbar from '../components/Navbar';
 
 interface Props {
    children : ReactNode;
 }

 const LoginLayout = ( {children}:Props) => {
   return (
     <div className='h-screen'>
        <Navbar/>
        <div>
            {children}
        </div>
     </div>
   )
 }
 
 export default LoginLayout
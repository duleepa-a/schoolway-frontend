import React , {ReactNode} from 'react'
import Navbar from '../components/Navbar';
 
 interface Props {
    children : ReactNode;
 }

 const LoginLayout = ( {children}:Props) => {
   return (
     <div className='h-screen flex flex-col'>
        <Navbar/>
        <main className='overflow-y-auto'>
            {children}
        </main>
     </div>
   )
 }
 
 export default LoginLayout
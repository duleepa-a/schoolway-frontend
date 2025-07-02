import React , {ReactNode} from 'react'
import Navbar from '../components/Navbar';
import Authprovider from "../AuthenticatorComp/provider";

 interface Props {
    children : ReactNode;
 }

 const LoginLayout = ( {children}:Props) => {
   return (
     <div className='h-screen flex flex-col'>
          <Authprovider>
          <Navbar />
        </Authprovider>
        <main className='overflow-y-auto'>
            {children}
        </main>
     </div>
   )
 }
 
 export default LoginLayout
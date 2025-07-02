import React , {ReactNode} from 'react'
import Navbar from '../components/Navbar';
import Authprovider from "../AuthenticatorComp/provider";

 
 interface Props {
    children : ReactNode;
 }

 const SignupLayout = ( {children}:Props) => {
   return (
     <div className='h-screen'>
        <Authprovider>
          <Navbar />
        </Authprovider>
        <div>
            {children}
        </div>
     </div>
   )
 }
 
 export default SignupLayout
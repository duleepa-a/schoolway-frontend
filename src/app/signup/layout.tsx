import React , {ReactNode} from 'react'
import Navbar from '../components/Navbar';
import Authprovider from "../AuthenticatorComp/provider";
import Footer from '../components/Footer';

 
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
        <Footer/>
     </div>
   )
 }
 
 export default SignupLayout
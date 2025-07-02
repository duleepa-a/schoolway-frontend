import React from 'react'
import SignUpForm from './SignUpForm'


const CredentialsPage = () => {
  return (
    <div className=" bg-cover bg-center bg-no-repeat relative justify-center justify-items-center p-12" 
          style={{backgroundImage: 'url("/illustrations/signupBackground.png")'}}
    >
    
        <SignUpForm/>

    </div>
  )
}

export default CredentialsPage
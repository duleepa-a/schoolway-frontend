'use client'
import React from 'react'
import SignUpForm from './SignUpForm'


const CredentialsPage = () => {
  return (
    <div
      className="bg-cover bg-center bg-no-repeat relative flex justify-center items-center p-12 min-h-screen"
      style={{
      backgroundImage: 'url("/illustrations/signupBackground.png")',
      backgroundAttachment: 'fixed',
      backgroundSize: 'cover',
      }}
    >
      <SignUpForm />
    </div>
  )
}

export default CredentialsPage
'use client';
import React from 'react'

const page = () => {
    const [user, setUser] = React.useState<any>(null);

    const usertoken = JSON.parse(localStorage.getItem('user') || '{}');

    React.useEffect(() => {
        // Fetch user data from localStorage or API
        if (usertoken) {
            setUser(usertoken);
        }
    }, []);
  
    return (
    <div>
      <p>{user}</p>
    </div>
  )
}

export default page

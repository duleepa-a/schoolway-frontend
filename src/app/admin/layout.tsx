import React, { ReactNode } from 'react'
import AdminSidebar from './components/sidebar'


interface Props{
    children : ReactNode;
}

const layout = ({children} : Props) => {
  return (
    <div className="flex h-full">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
  )
}

export default layout

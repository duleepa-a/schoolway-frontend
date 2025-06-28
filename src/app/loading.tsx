import React from 'react'

const Loading = () => {
  return (
    // <div>
    // <h1 className="text-3xl font-bold text-center text-blue-600 animate-pulse mt-32">
    //   Loading...
    // </h1>
    // </div>

        //check if this loading component is working properly with styles added on all cases!
    <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-xl text-warning"></span>
        {/* <span className="loading loading-ring loading-xl text-warning"></span> */}
    </div>
  )
}

export default Loading

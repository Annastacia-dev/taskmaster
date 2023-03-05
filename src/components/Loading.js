import React from 'react'

function Loading() {
  return (
    <div className='flex flex-col gap-3 justify-center items-center w-screen h-screen bg-gradient-to-r from-blue-900 to-blue-500 '>
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-yellow-300"></div>
    </div>
  )
}

export default Loading
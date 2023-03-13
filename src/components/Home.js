import { useState } from 'react';
import NavBar from './NavBar';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import NewTaskModal from './NewTaskModal';

import TasksTable from './TasksTable';

const Home = () => {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
    <div className='bg-gray-800 h-full'>
      <NavBar />
      <div className="flex justify-center">
        <button onClick={() => setShowModal(true)} className="border-yellow-300 border hover:bg-yellow-300 hover:text-black hover:bg-transparent text-yellow-300 font-bold py-2 px-4  mr-4 mt-4">
          <AiOutlinePlusCircle className="inline-block mr-2" />
          Add Task
        </button>
      </div>
      <div className="flex justify-center gap-10 mt-10 border-b border-gray-900">
          <h1 className="text-md mb-4 text-yellow-300 font-medium uppercase tracking-wider text-center">Tasks</h1>
      </div>
      <div className="container mx-auto px-4 mt-10">
        <TasksTable />
      </div>
       {showModal && <NewTaskModal setShowModal={setShowModal} />}
    </div>
    </>
  )
}

export default Home
import { GrFormClose } from 'react-icons/gr'

const EditTaskModal = ({setShowEditModal}) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
    <div className="relative w-11/12 max-w-3xl p-6 mx-auto bg-white shadow-lg md:w-2/3">
       <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-700">Edit Task</h2>
               <button className="text-gray-600 focus:outline-none focus:text-gray-900" onClick={() => setShowEditModal(false)}>
               <GrFormClose className="w-6 h-6" />
               </button>
               </div>
               <div className="mt-4">
                  
               </div>
   </div>
   
</div>
  )
}

export default EditTaskModal

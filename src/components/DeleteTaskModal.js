import { doc, deleteDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast, ToastContainer } from 'react-toastify'
import { GrFormClose } from 'react-icons/gr'

const DeleteTaskModal = ({ setShowDeleteModal, task}) => {

    const toastStyles = {
        position: 'top-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      }

    const handleDeleteTask = async (id) => {
        const taskRef = doc(db, 'tasks', id)
        try {
          await deleteDoc(taskRef)
          toast.error('Task deleted successfully', toastStyles)
          setShowDeleteModal(false)
          setTimeout(() => {
            window.location.reload()
          } , 2000)
        } catch (error) {
          console.log(error)
        }
      }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
         <div className="relative w-11/12 max-w-3xl p-6 mx-auto bg-white shadow-lg md:w-2/3">
            <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-700">Delete Task</h2>
                    <button className="text-gray-600 focus:outline-none focus:text-gray-900" onClick={() => setShowDeleteModal(false)}>
                    <GrFormClose className="w-6 h-6" />
                    </button>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-600">Are you sure you want to delete this task?</p>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="px-4 py-2 ml-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </div>

        </div>
        
    </div>
  )
}

export default DeleteTaskModal
import { GrFormClose } from 'react-icons/gr'
import { useContext, useState } from 'react'
import { UserContext } from '../contexts/user'
import { db, auth } from '../config/firebase'
import { setDoc, doc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import Loading from './Loading'


const EditTaskModal = ({setShowEditModal, task}) => {

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

  const { labels, priorities } = useContext(UserContext)

  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    labelId: task.labelId,
  })

  const [loading, setLoading] = useState(false)

  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEditTask = async (e, id) => {
    e.preventDefault()
    const { title, description, dueDate, priority, labelId } = formData
    const userId = auth.currentUser.uid
    const taskRef = doc(db, 'tasks', id)
    const updatedTask = {
      title,
      description,
      dueDate,
      priority,
      labelId,
      userId,
      completed: false
    }

    try {
      setLoading(true)
      await setDoc(taskRef, updatedTask)
      setLoading(false)
      toast.success('Task updated', toastStyles)
      setShowEditModal(false)
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      toast.error('Error updating task', toastStyles)
    } finally {
      setLoading(false)
    }
  }

  loading && <Loading />

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-10">
    <div className="relative w-10/12 max-w-3xl p-6 mx-auto bg-white shadow-lg md:w-2/3">
       <div className="flex items-center justify-between">
               <h2 className="text-lg font-semibold text-gray-700">Edit Task</h2>
               <button className="text-gray-600 focus:outline-none focus:text-gray-900" onClick={() => setShowEditModal(false)}>
               <GrFormClose className="w-6 h-6" />
               </button>
               </div>
               <form className="mt-4">
                  <label className="block text-sm text-gray-700">Title</label>
                  <input type="text" name="title" placeholder="Enter task title" value={formData.title}
                  className="w-full p-2 my-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent placeholder:text-center" onChange={handleChanges} />
                  <label className="block text-sm text-gray-700">Description</label>
                  <input type="text" name="description" placeholder="Enter task description" value={formData.description}
                  className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent placeholder:text-center" onChange={handleChanges} />
                  <label className="block text-sm text-gray-700">Due Date</label>
                  <input type="date" name="dueDate" placeholder="Enter task due date" value={formData.dueDate}
                  className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent placeholder:text-center" onChange={handleChanges} />
                  <label className="block text-sm text-gray-700">Priority</label>
                  <select name="priority" value={formData.priority} className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent" onChange={handleChanges}>
                  {priorities.map(priority => (
                    <option key={priority.id} value={priority.id}>{priority.name}</option>
                  ))}
                  </select>
                  <label className="block text-sm text-gray-700">Label</label>
                  <select name="labelId" value={formData.labelId} className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent" onChange={handleChanges}>
                  {labels.map(label => (
                    <option key={label.id} value={label.id}>{label.name}</option>
                  ))}
                  </select>
                  <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 text-sm font-medium hover:text-black hover:bg-yellow-300 rounded-md bg-gray-800 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                    onClick={(e) => handleEditTask(e, task.id)}>
                      Update Task
                    </button>
                    </div>
                </form>
   </div>
   
</div>
  )
}

export default EditTaskModal

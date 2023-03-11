import { useState, useContext } from 'react';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from "firebase/firestore";
import { GrFormClose } from 'react-icons/gr'
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../contexts/user';
import Loading from './Loading';



const NewTaskModal = ( { setShowModal }) => {

    const { labels, priorities } = useContext(UserContext)

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        priority: '',
        labelId: '',
      })

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

      const handleChanges = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value
        })
      }

        if (loading) return <Loading />

    const handleAddTask = async (e) => {
        e.preventDefault()
        const { title, description, dueDate, priority, labelId } = formData
        const userId = auth.currentUser.uid
        const tasksRef = collection(db, 'tasks')
        const newTask = {
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
          const docRef = await addDoc(tasksRef, newTask)
          toast.success('Task added successfully', toastStyles)
          setLoading(false)
          setShowModal(false)
          window.location.reload()
          console.log('Document written with ID: ', docRef.id)
        } catch (error) {
          setLoading(false)
          console.error('Error adding document: ', error)
        }
      }




  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
        <ToastContainer />
            <div className="relative w-11/12 max-w-3xl p-6 mx-auto bg-white shadow-lg md:w-2/3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Add Task</h2>
                <button className="text-gray-600 focus:outline-none focus:text-gray-900" onClick={() => setShowModal(false)}>
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
                  <select name="priority" value={formData.priority} className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent placeholder:text-center" onChange={handleChanges}>
                    <option value="">Select Priority</option>
                    {priorities.map((p, i) => (
                      <option key={i} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <label className="block text-sm text-gray-700">Label</label>
                  <select name="labelId" value={formData.labelId} className="w-full p-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent placeholder:text-center" onChange={handleChanges}>
                    <option value="">Select Label</option>
                    {labels.map((label, i) => (
                      <option key={i} value={label.id}>{label.name}</option>
                    ))}
                  </select>
                  <div className="flex justify-end mt-4">
                    <button className="px-4 py-2 text-sm font-medium hover:text-black hover:bg-yellow-300 rounded-md bg-gray-800 text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50"
                    onClick={handleAddTask}
                     >
                      Add Task
                    </button>
                    </div>
                    </form>
                    </div>
                    </div>
  )
}

export default NewTaskModal
import { auth, db } from '../config/firebase';
import { collection, getDocs, addDoc, setDoc, deleteDoc, getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { GrFormClose } from 'react-icons/gr'
import Loading from './Loading';
import { ToastContainer, toast } from 'react-toastify';

const Home = () => {

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

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    labelId: '',
  })

  //completed, userId
  //handle submit -post to db

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

  const [showModal, setShowModal] = useState(false)
  const [labels, setLabels] = useState([])
  const priorities = ['Low', 'Medium', 'High']
  

  const handleChanges = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }



  // fetch labels from db
  useEffect(() => {
    const fetchLabels = async () => {
      const labelsRef = collection(db, 'labels')
      const labelsSnapshot = await getDocs(labelsRef)
      const labelsList = labelsSnapshot.docs.map(doc =>({...doc.data(), id: doc.id}))
      setLabels(labelsList)
    }
    fetchLabels()
  }, [])


  //fetch tasks for the logged in user

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksRef = collection(db, 'tasks')
      const tasksSnapshot = await getDocs(tasksRef)
      const tasksList = tasksSnapshot.docs.map(doc =>({...doc.data(), id: doc.id}))
      setTasks(tasksList)
    }
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid)

  // update task

  const handleUpdateTask = async (id) => {
    const taskRef = doc(db, 'tasks', id)
    const taskSnapshot = await getDoc(taskRef)
    const taskData = taskSnapshot.data()

    const updatedTask = {
      ...taskData,
      completed: !taskData.completed
    }

    try {
      await setDoc(taskRef, updatedTask)
      toast.success('Task updated successfully', toastStyles)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  // delete task

  const handleDeleteTask = async (id) => {
    const taskRef = doc(db, 'tasks', id)
    try {
      await deleteDoc(taskRef)
      toast.error('Task deleted successfully', toastStyles)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }


  if (loading) return <Loading />

  return (
    <>
    <ToastContainer />
    <div className="min-h-screen bg-gray-800">
      <NavBar />
      <div className="flex flex-col items-center justify-center w-full h-full mt-10">
          <button className=" p-2 my-2 text-black hover:text-yellow-300 bg-yellow-300  hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-50" onClick={() => setShowModal(true)}>
            <AiOutlinePlusCircle className="inline-block w-6 h-6 mr-2" />
            <span className="inline-block font-bold">Create Task</span>
            </button>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full mt-10 ">
          <div className="w-11/12 max-w-3xl p-6 mx-auto shadow-lg md:w-2/3">
            <div className="flex items-center justify-center border-b border-yellow-300">
              <h2 className="text-lg font-semibold text-yellow-300">Tasks</h2>
            </div>
            <div className="mt-4">
              <ul className="space-y-4">
                {filteredTasks && filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between p-2 ">
                    <div className="flex items-center">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-700">{task.title}</span>
                        <span className="text-sm text-white">{task.description}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-white">{task.dueDate}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-white">{task.priority}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-white">{task.completed ? 'Completed' : 'Not Completed'}</span>
                      <span className="text-sm text-white">
                        {labels && labels.length > 0 && labels.map(label => label.id === task.labelId && label.name)}
                      </span>
                    </div>
                  </li>
                  ))
                ) : (
                  <p className="text-center text-white">No tasks yet</p>
                )}
              </ul>
            </div>
          </div>
        </div>
  
        {showModal && (
          <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-11/12 max-w-3xl p-6 mx-auto bg-white shadow-lg md:w-2/3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-700">Add Task</h2>
                <button className="text-gray-600 focus:outline-none focus:text-gray-900" onClick={() => setShowModal(false)}>
                  <GrFormClose className="w-6 h-6" />
                </button>
                </div>
                <div className="mt-4">
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
                      <option key={i} value={p}>{p}</option>
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
                    </div>
                    </div>
                    </div>
                    )}


      </div>
      </>
  )
}

export default Home
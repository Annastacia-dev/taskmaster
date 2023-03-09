import { auth, db } from '../config/firebase';
import { collection, getDocs, addDoc, setDoc, deleteDoc, getDoc, doc } from "firebase/firestore";
import { useState, useEffect } from 'react';
import NavBar from './NavBar';
import { AiOutlinePlusCircle, AiOutlineCheckCircle, AiOutlineDelete, AiOutlineLoading3Quarters } from 'react-icons/ai'
import { BsFillPencilFill } from 'react-icons/bs'
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

  const [editModal, setEditModal] = useState(false)

  
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
  const priorities = [{name: 'High', color:'red-500'}, {name: 'Medium', color:'yellow-300'}, {name: 'Low', color:'green-300'}]
  

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

  console.log(labels)


  //fetch tasks for the logged in user

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const tasksRef = collection(db, 'tasks')
        const tasksSnapshot = await getDocs(tasksRef)
        const tasksList = tasksSnapshot.docs.map(doc => ({...doc.data(), id: doc.id}))
        setTasks(tasksList)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter(task => task.userId === auth.currentUser.uid)

 

  // toggle completed task

  const handleCompletedTask = async (id) => {
    const taskRef = doc(db, 'tasks', id)
    const taskSnapshot = await getDoc(taskRef)
    const taskData = taskSnapshot.data()

    const updatedTask = {
      ...taskData,
      completed: !taskData.completed
    }

    try {
      await setDoc(taskRef, updatedTask)
      toast.success('Task marked completed', toastStyles)
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
          <div className="w-11/12 max-w-5xl p-6 mx-auto shadow-lg md:w-full">
            <div className="flex items-center justify-center border-b border-yellow-300">
              <h2 className="text-lg font-semibold text-yellow-300">Tasks</h2>
            </div>
            <div className="mt-4">
            <table className="w-full text-left table-auto border-separate border-spacing-x-0 border-spacing-y-6">
                    <thead>
                      <tr className='text-yellow-300'>
                        <th className="p-4">Completed</th>
                        <th className="p-4">Title</th>
                        <th className="p-4">Description</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Actions</th>
                        <th className="p-4">Label</th>
                      </tr>
                    </thead>
              {
                filteredTasks.map(task => (
                  <>
                    <tbody key={task.id}>
                      <tr className={` relative cursor-pointer p-4 hover:bg-yellow-300 hover:text-black ${task.completed ? 'bg-gray-900 text-white line-through' : 'bg-gray-900 text-white text-sm'}`} >
                      <td className='p-4' title = {task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      onClick={() => handleCompletedTask(task.id)}>{task.completed ? <AiOutlineCheckCircle className='ml-8' title="complete" /> : <AiOutlineLoading3Quarters title="incomplete" className='ml-8' />}</td>
                        <td className="p-4">{task.title}</td>
                        <td className="p-4">{task.description}</td>
                        <td className="p-4">
                          {priorities.map(priority => priority.name === task.priority && <span key={priority.name} className={`inline-block px-2 py-1 text-xs font-semibold leading-tight text-${priority.color} bg-gray-800 rounded-full`}>{priority.name}</span>)}
                          </td>
                          <td className="p-4">
                          <button title="Edit Task" className="text-blue-300 hover:text-blue-500 focus:outline-none focus:text-blue-500"
                          onClick={() => {
                            setEditModal(!editModal)
                          }}
                          >
                            <BsFillPencilFill className="inline-block w-4 h-4 mr-2" />
                          </button>

                          <button title="Delete Task" className="text-red-300 hover:text-red-500 focus:outline-none focus:text-red-500" onClick={() => handleDeleteTask(task.id)}>
                            <AiOutlineDelete className="inline-block w-5 h-5 mr-2" />
                          </button>
                        </td>
                        <td className="p-4">
                          <span> 
                            {labels.map(label => label.id === task.labelId && 
                            <div className='flex justify-center items-center'>
                              <span key={label.id} className={`absolute inline-block text-xs w-32 text-center font-semibold -right-20 text-black px-2 py-1 ml-3 
                               bg-${label.color ? label.color : 'blue-300'}`}>
                                 <i className={`${label.icon} mr-2`}></i>
                                {label.name}</span>
                              
                            </div>
                            )}
                            </span>
                          </td>
                      </tr>
                    </tbody>
                    </>
                ))
              }
              </table>
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
                    </div>
                    </div>
                    </div>
                    )}


      </div>
      </>
  )
}

export default Home
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [taskName, setTaskName] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [status, setStatus] = useState("To Do");
  const [data, setData] = useState([]);
  const [taskId, setTaskId] = useState(null);
  const [filter, setFilter] = useState("All");
  const[loading,setLoading] = useState(true)

  const filteredData =
    filter == "All" ? data : data.filter((d) => d.status == filter);

  useEffect(() => {
    const fetchData = async () => {
     try{
       const data = await axios.get(
        `https://6891df02447ff4f11fbe1c79.mockapi.io/tasks/tasks`
      );
      const result = data.data;
      setData(result);
     }
     catch(err){
      console.log(err)
     }
     finally{
      setLoading(false)
     }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (taskId) {
      const updateTask = {
        name: taskName,
        description: taskDesc,
        status: status,
      };
      const response = await axios.put(
        `https://6891df02447ff4f11fbe1c79.mockapi.io/tasks/tasks/${taskId}`,
        updateTask
      );
      setData(data.map((d) => (d.id == taskId ? response.data : d)));
      setTaskDesc("");
      setStatus("To do");
      setTaskName("");
      setTaskId(null);
    } else {
      if (!taskName || !taskDesc) {
        alert("Please fill all detail");
        return;
      }
      const newTask = {
        name: taskName,
        description: taskDesc,
        status: status,
      };

      try {
        const response = await axios.post(
          `https://6891df02447ff4f11fbe1c79.mockapi.io/tasks/tasks`,
          newTask
        );
        setData([response.data, ...data]);
        setTaskDesc("");
        setStatus("To do");
        setTaskName("");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleEdit = (task) => {
    setTaskName(task.name);
    setTaskDesc(task.description);
    setStatus(task.status);
    setTaskId(task.id);
  };

  const handleDelete = async (task) => {
    const response = await axios.delete(
      `https://6891df02447ff4f11fbe1c79.mockapi.io/tasks/tasks/${task.id}`
    );
    setData(data.filter((d) => d.id !== task.id));
  };

  return (
    <div className="bg-gray-300 flex items-center justify-center w-full min-h-screen">
      <div className="bg-white w-full max-w-xs sm:max-w-lg  my-10  md:max-w-xl rounded p-4">
        <h1 className="text-center font-semibold text-lg md:text-xl text-blue-950">
          Task Management App
        </h1>
        <div className="mt-5">
          <h3 className="text-blue-950 text-md md:text-lg mb-3">
            Add New Task
          </h3>
          <input
            type="text"
            value={taskName}
            placeholder="Task Name"
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1 rounded"
          />
          <textarea
            name=""
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Task Description"
            className="w-full border border-slate-200 px-2 py-1 rounded my-2 h-20"
            id=""
          ></textarea>
          <select
            name="" 
            value={status}
            id=""
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-slate-200 px-2 py-1 rounded"
          >
            <option value="To Do">To Do</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-blue-950 rounded text-center text-white py-1 w-full my-3 cursor-pointer"
          >
            {taskId ? "Update Task" : "Add Task"}
          </button>
        </div>

        <div className="my-3">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-blue-950 text-md md:text-lg mb-3">Task List</h1>
            <div>
              <label htmlFor="">Filter : </label>
              <select
                name=""
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                id=""
                className="border border-slate-300 rounded"
              >
                <option value="All">All</option>
                <option value="To do">To Do</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          {!loading && data.length == 0 ? (
            <div className="flex items-center justify-center">
              <p className="text-gray-400">No tasks found!</p>
            </div>
          ) : (
            <div className="mt-2">
              {filteredData.map((d) => (
                <div
                  key={d.id}
                  className="bg-gray-100 p-2 mb-2 rounded flex items-center justify-between w-full"
                >
                  <div>
                    <h1 className="text-md sm:text-lg">{d.name}</h1>
                    <h3 className="text-xs md:text-sm text-gray-600 my-1">
                      {d.description}
                    </h3>
                    <p className="text-md sm:text-lg">
                      Status :{" "}
                      <span
                        style={{
                          color:
                            d.status == "To do"
                              ? "red"
                              : d.status == "Completed"
                              ? "green"
                              : d.status == "Pending"
                              ? "orange"
                              : "black",
                        }}
                      >
                        {d.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(d)}
                      className="bg-blue-500 rounded-lg text-white px-2 py-1 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d)}
                      className="bg-red-500 rounded-lg text-white px-2 py-1  cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {loading && <div className="flex items-center justify-center"><p className="text-gray-500">Loading..</p></div> }
        </div>
      </div>
    </div>
  );
}

export default App;

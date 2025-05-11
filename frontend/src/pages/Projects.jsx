import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  //State for projrcts, clients and from
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("To Do");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  //Fetch the client and proejct when page load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      axios
        .get(`${import.meta.env.VITE_API_URL}/clients`, config)
        .then((res) => setClients(res.data))
        .catch(() => console.log("Error fetching clients"));

      axios
        .get(`${import.meta.env.VITE_API_URL}/projects`, config)
        .then((res) => setProjects(res.data))
        .catch(() => console.log("Error fetching projects"))
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  //Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check if the fileds are empty
    if (!clientId || !title || !budget) {
      setError("Please fill all the fields!!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/projects`,
        { clientId, title, budget: Number(budget), status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new project to list
      setProjects([...projects, res.data.project]);
      setClientId("");
      setTitle("");
      setBudget("");
      setStatus("To Do");
      setError("");
    } catch (err) {
      console.log(err);
      setError("Error adding project!!");
    }
  };

  if (loading) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="container my-4">
      <h2>New Project </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Client</label>
          <select
            className="form-control"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Budget</label>
          <input
            type="text"
            className="form-control"
            id="budget"
            name="budget"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-control"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
      </form>
      <h4>Projects List</h4>
      <ul className="list-group">
        {projects.map((project) => (
          <li key={project._id} className="list-group-item">
            {project.title} ({project.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Projects;

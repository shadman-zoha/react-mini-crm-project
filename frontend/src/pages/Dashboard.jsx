import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  // State for dashboard data
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [reminders, setReminders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); //State to handle the loding

  // Fetch data when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Get clients
      axios
        .get(`${import.meta.env.VITE_API_URL}/clients`, config)
        .then((res) => setClients(res.data))
        .catch(() => console.log("Error fetching clients"));

      // Get projects
      axios
        .get(`${import.meta.env.VITE_API_URL}/projects`, config)
        .then((res) => setProjects(res.data))
        .catch(() => console.log("Error fetching projects"));

      // Get reminders
      axios
        .get(`${import.meta.env.VITE_API_URL}/reminders`, config)
        .then((res) => setReminders(res.data))
        .catch(() => console.log("Error fetching reminders"))
        .finally(() => setLoading(false));
    }
  }, []);

  // Find reminders due this week
  const dueThisWeek = reminders.filter((reminder) => {
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return dueDate >= now && dueDate <= oneWeek;
  });

  if (loading) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex gap-3 flex-wrap">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Client</h5>
            <p className="card-text">{clients.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Total Projects</h5>
            <p className="card-text">{projects.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Reminders This Week</h5>
            <p className="card-text">{dueThisWeek.length}</p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4>Reminders Due This Week</h4>
        <ul className="list-group">
          {dueThisWeek.map((reminder) => (
            <li key={reminder._id} className="list-group-item">
              {reminder.message} (Due:{" "}
              {new Date(reminder.dueDate).toLocaleDateString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;

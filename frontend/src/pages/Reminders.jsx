import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reminders = () => {
  // State for reminders, clients, and form
  const [reminders, setReminders] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); //State to handle the loding
  const navigate = useNavigate();

  // Fetch clients and reminders when page loads
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
        .get(`${import.meta.env.VITE_API_URL}/reminders`, config)
        .then((res) => setReminders(res.data))
        .catch(() => console.log("Error fetching reminders"))
        .finally(() => setLoading(false));
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!clientId || !message || !dueDate) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/reminders`,
        { clientId, message, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Add new reminder to list
      setReminders([...reminders, res.data]);
      setClientId("");
      setMessage("");
      setDueDate("");
      setError("");
    } catch (err) {
      setError("Error adding reminder");
    }
  };
  if (loading) {
    return <div>Loading.....</div>;
  }
  return (
    <div className="container my-4">
      <h2>Set Reminder</h2>
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
          <label className="form-label">Message</label>
          <input
            type="text"
            className="form-control"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter reminder message"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="duedate" className="form-label">
            Due Date
          </label>
          <input
            type="date"
            className="form-control"
            id="duedate"
            name="duedate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <h4>Reminders List</h4>
      <ul className="list-group">
        {reminders.map((reminder, index) => {
          if (!reminder || !reminder.message || !reminder.dueDate) return null;
          return (
            <li key={reminder._id} className="list-group-item">
              {reminder.message} (Due:{" "}
              {new Date(reminder.dueDate).toLocaleDateString()})
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Reminders;

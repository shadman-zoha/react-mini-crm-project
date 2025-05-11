import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Clients = () => {
  const navigate = useNavigate();
  // State for clients and form vlaues to create new client
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); //State to handle the loding

  // Fetch clients when page loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      axios
        .get(`${import.meta.env.VITE_API_URL}/clients`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setClients(res.data))
        .catch(() => console.log("Error fetching clients"))
        .finally(() => setLoading(false));
    }
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Check if the field are empty
    if (!name || !email || !phone) {
      setError("Please fill all the fields!!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/clients`,
        { name, email, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      //Add new client to the list
      setClients((prevClients) =>
        Array.isArray(prevClients)
          ? [...prevClients, res.data.client]
          : [res.data]
      );

      setName("");
      setEmail("");
      setPhone("");
      setError("");
    } catch (err) {
      console.log(err);
      setError("Error adding client");
    }
  };

  if (loading) {
    return <div>Loading.....</div>;
  }

  return (
    <div className="container my-4">
      <h2>New Client Registration </h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
      <h3>Client List</h3>
      <ul className="list-group">
        {clients.map((client) => (
          <li key={client._id} className="list-group-item">
            {client.name} ({client.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Clients;

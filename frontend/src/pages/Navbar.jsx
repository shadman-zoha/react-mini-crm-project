import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  //State for the light/dark mode
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const token = localStorage.getItem("token");

  // Updta the theme when it change
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("bg-dark", "text-white");
    } else {
      document.body.classList.remove("bg-dark", "text-white");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle button for the light and dark mode
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Mini CRM
          </Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/dashboard" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/clients" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/clients"
                >
                  Clients
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/projects" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/projects"
                >
                  Projects
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname === "/reminders" ? "active" : ""
                  }`}
                  aria-current="page"
                  to="/reminders"
                >
                  Reminders
                </Link>
              </li>
            </ul>

            {!token && (
              <form className="d-flex" role="search">
                <Link
                  className="btn btn-primary mx-2"
                  to="/login"
                  role="button"
                >
                  Login
                </Link>
                <Link
                  className="btn btn-primary mx-2"
                  to="/signup"
                  role="button"
                >
                  Signup
                </Link>
              </form>
            )}
            <button className="btn btn-light" onClick={toggleTheme}>
              {theme === "light" ? "Dark Mode" : "Light Mode"}
            </button>

            {token && (
              <button className="btn btn-primary mx-2" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;

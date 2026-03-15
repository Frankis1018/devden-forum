import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div>
        <h1>DevDen Forum</h1>
        <p>A themed Q&amp;A space for learning modern web development.</p>
      </div>

      <div className="header-actions">
        <span className="welcome-text">Welcome, {user?.username}</span>
        <Link className="button button-secondary" to="/questions/new">
          Ask a Question
        </Link>
        <button className="button button-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

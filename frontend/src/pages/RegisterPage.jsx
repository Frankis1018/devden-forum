import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=.?]{8,}$/;

function validate(form) {
  const errors = {};

  if (!form.username.trim()) {
    errors.username = "Username is required.";
  } else if (!usernameRegex.test(form.username.trim())) {
    errors.username =
      "Username must be 3-20 characters and use letters, numbers, or underscores only.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (!passwordRegex.test(form.password)) {
    errors.password =
      "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!form.acceptedTerms) {
    errors.acceptedTerms = "You must accept the terms and privacy policy.";
  }

  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = validate(form);
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await register(form);
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.message || "Registration failed.");
      setFieldErrors(error.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-card wide">
        <div className="auth-intro">
          <span className="pill">Create account</span>
          <h1>Join DevDen Forum</h1>
          <p>Build your account to post questions, share answers, and explore topic categories.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              className={fieldErrors.username ? "input error" : "input"}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
            {fieldErrors.username ? <span className="error-text">{fieldErrors.username}</span> : null}
          </label>

          <label>
            Password
            <input
              className={fieldErrors.password ? "input error" : "input"}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a strong password"
            />
            {fieldErrors.password ? <span className="error-text">{fieldErrors.password}</span> : null}
          </label>

          <label>
            Repeat password
            <input
              className={fieldErrors.confirmPassword ? "input error" : "input"}
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
            {fieldErrors.confirmPassword ? (
              <span className="error-text">{fieldErrors.confirmPassword}</span>
            ) : null}
          </label>

          <label className={fieldErrors.acceptedTerms ? "checkbox-row checkbox-row-error" : "checkbox-row"}>
            <input
              type="checkbox"
              name="acceptedTerms"
              checked={form.acceptedTerms}
              onChange={handleChange}
            />
            <span>I accept the terms of service and privacy policy.</span>
          </label>
          {fieldErrors.acceptedTerms ? <span className="error-text">{fieldErrors.acceptedTerms}</span> : null}

          {message ? <p className="error-text">{message}</p> : null}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="helper-text">
            Already registered? <Link to="/login">Go to login</Link>
          </p>
        </form>
      </section>
    </main>
  );
}

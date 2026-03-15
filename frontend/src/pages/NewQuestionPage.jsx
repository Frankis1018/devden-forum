import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { apiRequest } from "../api";

export default function NewQuestionPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ categoryId: "", body: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiRequest("/categories")
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setForm((current) => ({ ...current, categoryId: data[0]._id }));
        }
      })
      .catch((error) => setMessage(error.message || "Could not load categories."));
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setFieldErrors((current) => ({ ...current, [event.target.name]: "" }));
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.categoryId) {
      nextErrors.categoryId = "Please choose a category.";
    }
    if (!form.body.trim()) {
      nextErrors.body = "Question cannot be empty.";
    } else if (!form.body.trim().endsWith("?")) {
      nextErrors.body = "Question must end with a question mark.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest("/questions", {
        method: "POST",
        body: JSON.stringify(form),
      });
      navigate(`/questions/${response.question._id}`);
    } catch (error) {
      setMessage(error.message || "Could not post question.");
      setFieldErrors(error.fieldErrors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="dashboard-layout">
      <Header />

      <section className="form-panel">
        <div className="panel-heading">
          <div>
            <h2>Ask a new question</h2>
            <p>Write a clear question and select the most relevant category.</p>
          </div>
          <Link className="button button-secondary" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Category
            <select
              className={fieldErrors.categoryId ? "input error" : "input"}
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {fieldErrors.categoryId ? <span className="error-text">{fieldErrors.categoryId}</span> : null}
          </label>

          <label>
            Question
            <textarea
              className={fieldErrors.body ? "input error" : "input"}
              name="body"
              rows="6"
              value={form.body}
              onChange={handleChange}
              placeholder="Example: Why does my React state update asynchronously?"
            />
            {fieldErrors.body ? <span className="error-text">{fieldErrors.body}</span> : null}
          </label>

          {message ? <p className="error-text">{message}</p> : null}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Question"}
          </button>
        </form>
      </section>
    </main>
  );
}

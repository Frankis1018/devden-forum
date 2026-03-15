import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import Header from "../components/Header";
import CategorySidebar from "../components/CategorySidebar";
import QuestionList from "../components/QuestionList";

export default function DashboardPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiRequest("/categories");
        setCategories(data);
      } catch (error) {
        setMessage(error.message || "Could not load categories.");
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  const handleSelectCategory = async (category) => {
    setActiveCategory(category);
    setQuestionsLoading(true);
    setMessage("");

    try {
      const data = await apiRequest(`/categories/${category._id}/questions`);
      setQuestions(data.questions);
    } catch (error) {
      setMessage(error.message || "Could not load questions.");
      setQuestions([]);
    } finally {
      setQuestionsLoading(false);
    }
  };

  return (
    <main className="dashboard-layout">
      <Header />

      {message ? <div className="notice error-notice">{message}</div> : null}

      <div className="dashboard-grid">
        <CategorySidebar
          categories={categories}
          activeCategoryId={activeCategory?._id}
          onSelect={handleSelectCategory}
        />

        {loading || questionsLoading ? (
          <section className="panel">
            <p>Loading...</p>
          </section>
        ) : (
          <QuestionList category={activeCategory} questions={questions} />
        )}
      </div>
    </main>
  );
}

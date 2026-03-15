import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import AddAnswerModal from "../components/AddAnswerModal";
import { apiRequest } from "../api";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

export default function QuestionDetailPage() {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadQuestion = async () => {
    try {
      const data = await apiRequest(`/questions/${questionId}`);
      setQuestion(data);
    } catch (error) {
      setMessage(error.message || "Could not load question.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestion();
  }, [questionId]);

  const handleSubmitAnswer = async (body) => {
    setSubmitting(true);

    try {
      const response = await apiRequest(`/questions/${questionId}/answers`, {
        method: "POST",
        body: JSON.stringify({ body }),
      });
      setQuestion(response.question);
      setModalOpen(false);
      setMessage("");
    } catch (error) {
      setMessage(error.message || "Could not save answer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="dashboard-layout">
      <Header />

      <section className="form-panel">
        <div className="panel-heading">
          <div>
            <h2>Question details</h2>
            <p>Read the thread and contribute an answer through the modal form.</p>
          </div>
          <div className="inline-actions">
            <Link className="button button-secondary" to="/dashboard">
              Back to Dashboard
            </Link>
            <button className="button" onClick={() => setModalOpen(true)}>
              Add Answer
            </button>
          </div>
        </div>

        {message ? <p className="error-text">{message}</p> : null}

        {loading ? (
          <p>Loading...</p>
        ) : question ? (
          <>
            <article className="question-detail-card">
              <span className="pill">{question.categoryName}</span>
              <h3>{question.body}</h3>
              <p className="meta-text">
                Asked by {question.authorName} · {formatDate(question.createdAt)}
              </p>
            </article>

            <section className="answers-section">
              <div className="panel-heading">
                <h3>Answers</h3>
                <span className="pill subtle">{question.answers.length} total</span>
              </div>

              {question.answers.length === 0 ? (
                <div className="empty-state">
                  <p>No answers yet. Be the first to respond.</p>
                </div>
              ) : (
                <div className="answer-list">
                  {question.answers.map((answer) => (
                    <article key={answer._id} className="answer-card">
                      <p>{answer.body}</p>
                      <p className="meta-text">
                        By {answer.authorName} · {formatDate(answer.createdAt)}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </section>

      <AddAnswerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitAnswer}
        loading={submitting}
      />
    </main>
  );
}

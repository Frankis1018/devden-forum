import { Link } from "react-router-dom";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

export default function QuestionList({ category, questions }) {
  if (!category) {
    return (
      <section className="panel empty-panel">
        <h2>Select a category</h2>
        <p>Choose a category from the left to view its questions.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>{category.name}</h2>
          <p>{category.description}</p>
        </div>
        <span className="pill">{questions.length} question(s)</span>
      </div>

      {questions.length === 0 ? (
        <div className="empty-state">
          <p>No questions have been posted in this category yet.</p>
        </div>
      ) : (
        <div className="question-list">
          {questions.map((question) => (
            <Link
              key={question._id}
              className="question-card"
              to={`/questions/${question._id}`}
            >
              <div className="question-card-top">
                <span className="pill subtle">{question.categoryName}</span>
                <span className="meta-text">{formatDate(question.createdAt)}</span>
              </div>
              <h3>{question.body}</h3>
              <p className="meta-text">
                Asked by {question.authorName} · {question.answers.length} answer(s)
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

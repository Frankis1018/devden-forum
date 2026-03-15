import { useEffect, useState } from "react";

export default function AddAnswerModal({ isOpen, onClose, onSubmit, loading }) {
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setBody("");
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!body.trim()) {
      setError("Answer cannot be empty.");
      return;
    }

    await onSubmit(body);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>Add your answer</h3>
          <button className="icon-button" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <textarea
            className={error ? "input error" : "input"}
            rows="7"
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError("");
            }}
            placeholder="Write a clear and helpful answer..."
          />

          {error ? <p className="error-text">{error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button" disabled={loading}>
              {loading ? "Submitting..." : "Submit Answer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

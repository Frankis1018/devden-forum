const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=.?]{8,}$/;

export function validateUsername(username) {
  if (!username?.trim()) {
    return "Username is required.";
  }

  if (!USERNAME_REGEX.test(username.trim())) {
    return "Username must be 3-20 characters and use letters, numbers, or underscores only.";
  }

  return "";
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (!PASSWORD_REGEX.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, and a number.";
  }

  return "";
}

export function validateQuestionBody(body) {
  const text = (body || "").trim();

  if (!text) {
    return "Question cannot be empty.";
  }

  if (!text.endsWith("?")) {
    return "Question must end with a question mark.";
  }

  return "";
}

export function validateAnswerBody(body) {
  const text = (body || "").trim();

  if (!text) {
    return "Answer cannot be empty.";
  }

  return "";
}

export function sanitizeText(text) {
  return (text || "").trim().replace(/\s+/g, " ");
}

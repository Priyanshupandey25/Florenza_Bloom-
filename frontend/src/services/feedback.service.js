/**
 * Feedback Service
 * Layer 1: API communication for Customer Reviews & Feedback.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : "";

/**
 * Process fetch responses and extract error messages.
 */
async function handleResponse(response) {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(", ") : null) ||
      `Request failed with status ${response.status}`;

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Submit customer feedback/review.
 * @param {Object} payload - { fullName, email, phone, subject, message }
 * @returns {Promise<{ message: string, success: boolean, feedback: Object }>}
 */
export async function submitFeedback({ fullName, email, phone, subject, message }) {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      fullName: fullName?.trim(),
      email: email?.trim(),
      phone: phone ? phone.trim() : null,
      subject: subject || "Product Inquiry",
      message: message?.trim(),
    }),
  });

  return handleResponse(response);
}

/**
 * Fetch all customer feedback/reviews.
 * @returns {Promise<{ message: string, success: boolean, feedback: Array }>}
 */
export async function fetchFeedback() {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response);
}

export default {
  submitFeedback,
  fetchFeedback,
};

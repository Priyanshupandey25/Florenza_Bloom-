/**
 * Authentication Service
 * Layer 1: Pure API communication service.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL !== undefined
    ? import.meta.env.VITE_API_URL
    : "";

/**
 * Helper to process fetch responses and extract meaningful error messages.
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
      data?.err ||
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
 * Register a new user.
 * @param {Object} payload - { name, email, password, isSeller }
 * @returns {Promise<{ message: string, success: boolean, user: Object }>}
 */
export async function registerUser({ name, email, password, isSeller = false }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name: name?.trim(),
      email: email?.trim(),
      password,
      isSeller: Boolean(isSeller),
    }),
  });

  return handleResponse(response);
}

/**
 * Authenticate an existing user with email and password.
 * @param {Object} credentials - { email, password }
 * @returns {Promise<{ message: string, success: boolean, user: Object }>}
 */
export async function loginUser({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: email?.trim(),
      password,
    }),
  });

  return handleResponse(response);
}

/**
 * Fetch the currently authenticated user's profile using the session cookie.
 * @returns {Promise<{ message: string, success: boolean, user: Object }>}
 */
export async function getMe() {
  const response = await fetch(`${API_BASE_URL}/api/auth/get-me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse(response);
}

/**
 * Logout the user by clearing the backend session cookie.
 * @returns {Promise<{ message: string, success: boolean }>}
 */
export async function logoutUser() {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch {
    // If backend doesn't have a logout route, continue
  }

  // Clear cookie from client document if accessible
  try {
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    document.cookie =
      "token=; path=/; domain=" +
      window.location.hostname +
      "; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
  } catch {
    // Ignored in non-browser environments
  }

  return { message: "Logged out", success: true };
}

export default {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
};

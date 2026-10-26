/**
 * Centralized API service for Student Internship Portal.
 * Handles baseURL resolution, trailing-slash normalization, headers, and error handling.
 */

// If VITE_API_URL is configured (e.g. in production pointing to Render), normalize it.
// If empty, relative requests to /api are proxied by Vite during local development.
const rawApiUrl = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = rawApiUrl.trim().replace(/\/+$/, '');

/**
 * Safely parse JSON or return null
 */
async function parseResponse(response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || `HTTP error ${response.status}: ${response.statusText}` };
  }
}

/**
 * Fetch list of all available internships
 */
export async function getInternships() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/internships`);
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Unable to load internships at this time.');
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please check your internet connection or server status.');
    }
    throw err;
  }
}

/**
 * Fetch a single internship by ID
 */
export async function getInternshipById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/internships/${encodeURIComponent(id)}`);
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Internship not found.');
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please try again.');
    }
    throw err;
  }
}

/**
 * Submit an internship application
 */
export async function submitApplication(applicationData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(applicationData),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error(data.error || 'Validation error: Please check all required fields.');
      }
      if (response.status === 404) {
        throw new Error(data.error || 'The selected internship was not found or is no longer available.');
      }
      if (response.status === 503) {
        throw new Error(data.error || 'The database is temporarily unavailable. Please try again shortly.');
      }
      throw new Error(data.error || `Server error (${response.status}): Unable to submit application.`);
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the backend server. Please verify your connection or try again.');
    }
    throw err;
  }
}

/**
 * Fetch all submitted applications from the database
 */
export async function getApplications() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/applications`);
    const data = await parseResponse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Unable to retrieve applications.');
    }

    return Array.isArray(data) ? data : [];
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Unable to connect to the backend server. Please check server status.');
    }
    throw err;
  }
}

/**
 * Check backend health
 */
export async function getHealthStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await parseResponse(response);
  } catch {
    return { status: 'Down', database: 'disconnected' };
  }
}

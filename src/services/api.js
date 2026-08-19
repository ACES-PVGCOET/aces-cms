/**
 * ACES CMS — Centralized Backend API Client Service
 * Base URL defaults to http://localhost:5000/api/v1 or VITE_API_URL environment variable.
 */

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(endpoint, options = {}) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      ...options,
      headers,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `API request failed with status ${response.status}`);
    }
    return data;
  } catch (error) {
    console.warn(`[API Client Warning] Call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// --- ANNOUNCEMENTS API ---
export const announcementsApi = {
  getAll: async () => {
    const res = await request('/announcements');
    return res.data?.announcements || res.data || [];
  },
  getById: async (id) => {
    const res = await request(`/announcements/${id}`);
    return res.data;
  },
  create: async (announcementData) => {
    const res = await request('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
    return res.data;
  },
  update: async (id, announcementData) => {
    const res = await request(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await request(`/announcements/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};

// --- EVENTS API ---
export const eventsApi = {
  getAll: async () => {
    const res = await request('/events');
    return res.data?.events || res.data || [];
  },
  getHighlights: async () => {
    const res = await request('/events/highlights');
    return res.data?.events || res.data || [];
  },
  getById: async (id) => {
    const res = await request(`/events/${id}`);
    return res.data;
  },
  create: async (eventData) => {
    const res = await request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
    return res.data;
  },
  update: async (id, eventData) => {
    const res = await request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await request(`/events/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};

// --- MEMBERS / IAM API ---
export const membersApi = {
  getAll: async () => {
    const res = await request('/iam/members');
    return res.data?.members || res.data || [];
  },
  getProfile: async () => {
    const res = await request('/iam/me');
    return res.data;
  },
  login: async (email, password) => {
    const res = await request('/iam/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return res.data;
  },
  logout: async () => {
    const res = await request('/iam/logout', {
      method: 'POST',
    });
    return res.data;
  },
  register: async (memberData) => {
    const res = await request('/iam/register', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    return res.data;
  },
  bulkRegister: async (sheetUrl) => {
    const res = await request('/iam/bulk-register', {
      method: 'POST',
      body: JSON.stringify({ sheet_url: sheetUrl }),
    });
    return res.data;
  },
  onboard: async ({ token, password, name }) => {
    const res = await request('/iam/onboard', {
      method: 'POST',
      body: JSON.stringify({ token, password, name }),
    });
    return res.data;
  },
  updateProfile: async (id, memberData) => {
    const isFormData = memberData instanceof FormData;
    const res = await request(`/iam/members/${id}`, {
      method: 'PUT',
      body: isFormData ? memberData : JSON.stringify(memberData),
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await request(`/iam/members/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};

// --- GALLERY & MEDIA STORAGE API ---
export const galleryApi = {
  getUploadSignature: async (folder = 'events', resourceType = 'image') => {
    const query = `?folder=${encodeURIComponent(folder)}&resource_type=${encodeURIComponent(resourceType)}`;
    const res = await request(`/gallery/upload-signature${query}`);
    return res.data;
  },
  getItems: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.collection_name) searchParams.append('collection_name', params.collection_name);
    if (params.media_type) searchParams.append('media_type', params.media_type);
    if (params.type) searchParams.append('type', params.type);
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/gallery/items${queryString}`);
    return res.data;
  },
  getShowcase: async () => {
    const res = await request('/gallery/showcase');
    return res.data;
  },
  getCollectionByName: async (collectionName) => {
    const res = await request(`/gallery/collections/${encodeURIComponent(collectionName)}`);
    return res.data;
  },
  renameCollection: async (oldName, newName) => {
    const res = await request(`/gallery/collections/${encodeURIComponent(oldName)}`, {
      method: 'PUT',
      body: JSON.stringify({ new_collection_name: newName }),
    });
    return res.data;
  },
  createItem: async (itemData) => {
    const res = await request('/gallery/items', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
    return res.data;
  },
  updateItem: async (id, itemData) => {
    const res = await request(`/gallery/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
    return res.data;
  },
  deleteItem: async (id) => {
    const res = await request(`/gallery/items/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await request(`/gallery/items/${id}`, {
      method: 'DELETE',
    });
    return res.data;
  },
};

// --- FORMS ENGINE API ---
export const formsApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.is_active !== undefined && params.is_active !== null && params.is_active !== '') {
      searchParams.append('is_active', params.is_active);
    }
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await request(`/forms${queryString}`);
    return res.data;
  },
  getById: async (formId) => {
    const res = await request(`/forms/${formId}`);
    return res.data;
  },
  create: async (formData) => {
    const res = await request('/forms', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    return res.data;
  },
  update: async (formId, updateData) => {
    const res = await request(`/forms/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return res.data;
  },
  delete: async (formId) => {
    const res = await request(`/forms/${formId}`, {
      method: 'DELETE',
    });
    return res.data;
  },
  submitResponse: async (formId, answers, email) => {
    const res = await request(`/forms/${formId}/responses`, {
      method: 'POST',
      body: JSON.stringify({ email, answers }),
    });
    return res.data;
  },
  checkResponseExists: async (formId, email) => {
    const res = await request(`/forms/${formId}/responses/check?email=${encodeURIComponent(email)}`);
    return res.data;
  },
  getResponses: async (formId) => {
    const res = await request(`/forms/${formId}/responses`);
    return res.data;
  },
  getSingleResponse: async (formId, responseId) => {
    const res = await request(`/forms/${formId}/responses/${responseId}`);
    return res.data;
  },
};

/**
 * Upload a file directly to Cloudinary using presigned upload signature generated by API.
 * Supports image, video, and raw/document files.
 */
export const uploadToCloudinary = async (file, folder = 'general', resourceType = 'image') => {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // 1. Get presigned upload signature from backend API
  const sigData = await galleryApi.getUploadSignature(folder, resourceType);
  const { upload_url, signature, timestamp, api_key, folder: targetFolder } = sigData;

  // 2. Build FormData payload for Cloudinary direct upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', targetFolder);

  // 3. Post binary data directly to Cloudinary CDN URL
  const uploadRes = await fetch(upload_url, {
    method: 'POST',
    body: formData,
  });

  if (!uploadRes.ok) {
    const errJson = await uploadRes.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `Cloudinary upload failed with status ${uploadRes.status}`);
  }

  const cloudResult = await uploadRes.json();
  return cloudResult.secure_url || cloudResult.url;
};

export default {
  announcements: announcementsApi,
  events: eventsApi,
  members: membersApi,
  gallery: galleryApi,
  forms: formsApi,
  uploadToCloudinary,
};


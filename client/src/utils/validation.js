// Form validation utilities

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().trim().length >= minLength;
};

export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return true;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateImageFile = (file) => {
  if (!file) return true;
  return file.type.startsWith('image/');
};

// Validation error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters long',
  PASSWORDS_DONT_MATCH: 'Passwords do not match',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_IMAGE: 'Please select a valid image file',
  MIN_LENGTH: (length) => `Must be at least ${length} characters long`
};
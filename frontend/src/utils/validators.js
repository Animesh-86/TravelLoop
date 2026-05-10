/* ────────────────────────────────────────────
   Form Validators
   ──────────────────────────────────────────── */

export const validators = {
  email: (value) => {
    if (!value) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Please enter a valid email address';
    return '';
  },

  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (value.length > 100) return 'Password must be less than 100 characters';
    return '';
  },

  fullName: (value) => {
    if (!value) return 'Full name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 100) return 'Name must be less than 100 characters';
    return '';
  },

  phoneNumber: (value) => {
    if (!value) return ''; // optional
    const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
    if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
    return '';
  },

  city: (value) => {
    if (!value) return ''; // optional
    if (value.length > 100) return 'City name is too long';
    return '';
  },

  country: (value) => {
    if (!value) return ''; // optional
    if (value.length > 100) return 'Country name is too long';
    return '';
  },

  required: (value, fieldName = 'This field') => {
    if (!value || !value.toString().trim()) return `${fieldName} is required`;
    return '';
  },
};

/**
 * Validate multiple fields at once
 * @param {Object} fields - { fieldName: value }
 * @param {Object} rules - { fieldName: validatorFunction }
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateForm = (fields, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const error = rules[field](fields[field]);
    if (error) {
      errors[field] = error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

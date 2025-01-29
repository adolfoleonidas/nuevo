// js/services/JobService.js
export class JobService {
  constructor() {
    this.baseUrl = '/api/jobs'; // Ajusta según tu configuración
  }

  async getJobs(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${this.baseUrl}?${queryParams}`);

      if (!response.ok) {
        throw new Error('Error al obtener los trabajos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en JobService.getJobs:', error);
      throw error;
    }
  }

  async getJobDetail(jobId) {
    try {
      const response = await fetch(`${this.baseUrl}/${jobId}`);

      if (!response.ok) {
        throw new Error('Error al obtener el detalle del trabajo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en JobService.getJobDetail:', error);
      throw error;
    }
  }

  async searchJobs(searchParams) {
    try {
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${this.baseUrl}/search?${queryParams}`);

      if (!response.ok) {
        throw new Error('Error en la búsqueda de trabajos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en JobService.searchJobs:', error);
      throw error;
    }
  }
}

// js/services/ApiService.js
export class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}${endpoint}${
      queryParams ? `?${queryParams}` : ''
    }`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ApiService.get:', error);
      throw error;
    }
  }

  async post(endpoint, data = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en ApiService.post:', error);
      throw error;
    }
  }
}

// js/utils/formatters.js
export const formatters = {
  currency(amount, currency = 'PEN') {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  date(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  },

  timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 7) {
      return this.date(dateString);
    } else if (days > 0) {
      return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
    } else if (hours > 0) {
      return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
    } else if (minutes > 0) {
      return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
    } else {
      return 'hace un momento';
    }
  },
};

// js/utils/validators.js
export const validators = {
  required(value) {
    return (
      value !== null && value !== undefined && value.toString().trim() !== ''
    );
  },

  email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  minLength(value, min) {
    return value.length >= min;
  },

  maxLength(value, max) {
    return value.length <= max;
  },
};

// js/utils/helpers.js
export const helpers = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
};

// js/components/Hero.js
export class Hero {
  constructor() {
    this.init();
  }

  init() {
    this.element = document.querySelector('.hero');
    this.searchForm = this.element.querySelector('.search-bar__form');
    this.setupEventListeners();
    this.initAnimations();
  }

  setupEventListeners() {
    // Manejo del formulario de búsqueda
    this.searchForm.addEventListener('submit', this.handleSearch.bind(this));

    // Manejo de autocompletado de ubicación
    const locationInput = this.searchForm.querySelector('[name="location"]');
    locationInput.addEventListener(
      'input',
      this.handleLocationInput.bind(this)
    );

    // Validación en tiempo real
    const inputs = this.searchForm.querySelectorAll('input, select');
    inputs.forEach((input) => {
      input.addEventListener('input', this.validateInput.bind(this));
    });
  }

  handleSearch(event) {
    event.preventDefault();
    const formData = new FormData(this.searchForm);
    const searchData = Object.fromEntries(formData);

    // Disparar evento personalizado con los datos de búsqueda
    const searchEvent = new CustomEvent('jobSearch', {
      detail: searchData,
      bubbles: true,
    });
    this.element.dispatchEvent(searchEvent);
  }

  handleLocationInput(event) {
    const input = event.target;
    const value = input.value.trim();

    if (value.length >= 3) {
      this.suggestLocations(value);
    }
  }

  async suggestLocations(query) {
    try {
      const response = await fetch(
        `/api/locations?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error('Error al obtener ubicaciones');

      const locations = await response.json();
      this.showLocationSuggestions(locations);
    } catch (error) {
      console.error('Error en la sugerencia de ubicaciones:', error);
    }
  }

  showLocationSuggestions(locations) {
    const suggestionsList = this.element.querySelector('.location-suggestions');
    if (!suggestionsList) return;

    suggestionsList.innerHTML = locations
      .map(
        (location) => `
              <li class="location-suggestion-item">
                  <button type="button" data-value="${location.id}">
                      <i class="fas fa-map-marker-alt"></i>
                      ${location.name}
                  </button>
              </li>
          `
      )
      .join('');
  }

  validateInput(event) {
    const input = event.target;
    const value = input.value.trim();
    const isValid = this.validateField(input.name, value);

    if (!isValid) {
      input.classList.add('error');
      this.showError(input, this.getErrorMessage(input.name));
    } else {
      input.classList.remove('error');
      this.clearError(input);
    }
  }

  validateField(fieldName, value) {
    switch (fieldName) {
      case 'query':
        return value.length >= 3;
      case 'location':
        return value === '' || value.length >= 2;
      case 'jobType':
        return true; // Siempre válido ya que es un select
      default:
        return true;
    }
  }

  getErrorMessage(fieldName) {
    const messages = {
      query: 'Ingresa al menos 3 caracteres',
      location: 'Ingresa al menos 2 caracteres',
    };
    return messages[fieldName] || 'Campo inválido';
  }

  showError(input, message) {
    let errorElement = input.parentElement.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      input.parentElement.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearError(input) {
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  initAnimations() {
    // Añadir clase para iniciar animación de fade-in
    this.element.classList.add('animate-fade-in');

    // Observer para animaciones al hacer scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observar elementos que necesitan animación
    const animatedElements =
      this.element.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));
  }
}

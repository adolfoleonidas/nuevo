// js/components/JobFilter.js
export class JobFilter {
  constructor(config = {}) {
    this.onFilter = config.onFilter || (() => {});
    this.filters = {
      jobType: '',
      salary: '',
      location: '',
      experience: '',
      date: '',
    };
    this.init();
  }

  init() {
    this.element = document.querySelector('.job-filters');
    if (!this.element) return;

    this.renderFilters();
    this.setupEventListeners();
  }

  renderFilters() {
    this.element.innerHTML = `
          <div class="filters-section">
              <h3 class="filters-title">Filtrar por</h3>
              
              <div class="filter-group">
                  <label class="filter-label">Tipo de trabajo</label>
                  <select name="jobType" class="filter-select">
                      <option value="">Todos</option>
                      <option value="FULL_TIME">Tiempo completo</option>
                      <option value="PART_TIME">Medio tiempo</option>
                      <option value="CONTRACT">Contrato</option>
                      <option value="TEMPORARY">Temporal</option>
                  </select>
              </div>

              <div class="filter-group">
                  <label class="filter-label">Rango salarial</label>
                  <select name="salary" class="filter-select">
                      <option value="">Todos</option>
                      <option value="0-1000">0 - 1,000</option>
                      <option value="1001-2000">1,001 - 2,000</option>
                      <option value="2001-3000">2,001 - 3,000</option>
                      <option value="3001+">3,001+</option>
                  </select>
              </div>

              <div class="filter-group">
                  <label class="filter-label">Ubicación</label>
                  <select name="location" class="filter-select">
                      <option value="">Todas</option>
                      <option value="ICA">Ica</option>
                      <option value="CHINCHA">Chincha</option>
                      <option value="PISCO">Pisco</option>
                  </select>
              </div>

              <div class="filter-group">
                  <label class="filter-label">Experiencia</label>
                  <select name="experience" class="filter-select">
                      <option value="">Todas</option>
                      <option value="0-1">0 - 1 año</option>
                      <option value="1-3">1 - 3 años</option>
                      <option value="3-5">3 - 5 años</option>
                      <option value="5+">5+ años</option>
                  </select>
              </div>

              <div class="filter-group">
                  <label class="filter-label">Fecha de publicación</label>
                  <select name="date" class="filter-select">
                      <option value="">Todas</option>
                      <option value="today">Hoy</option>
                      <option value="week">Última semana</option>
                      <option value="month">Último mes</option>
                  </select>
              </div>

              <div class="filter-actions">
                  <button type="button" class="btn btn-secondary" data-action="clear">
                      Limpiar filtros
                  </button>
              </div>
          </div>
      `;
  }

  setupEventListeners() {
    // Manejar cambios en los filtros
    const filterInputs = this.element.querySelectorAll('select');
    filterInputs.forEach((input) => {
      input.addEventListener('change', this.handleFilterChange.bind(this));
    });

    // Manejar botón de limpiar
    const clearButton = this.element.querySelector('[data-action="clear"]');
    if (clearButton) {
      clearButton.addEventListener('click', this.handleClearFilters.bind(this));
    }
  }

  handleFilterChange(event) {
    const { name, value } = event.target;
    this.filters[name] = value;
    this.applyFilters();
  }

  handleClearFilters() {
    // Resetear todos los filtros
    Object.keys(this.filters).forEach((key) => {
      this.filters[key] = '';
    });

    // Resetear los elementos del formulario
    const filterInputs = this.element.querySelectorAll('select');
    filterInputs.forEach((input) => {
      input.value = '';
    });

    this.applyFilters();
  }

  applyFilters() {
    // Eliminar valores vacíos
    const activeFilters = Object.entries(this.filters).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {}
    );

    // Notificar cambios
    this.onFilter(activeFilters);
    this.updateActiveFiltersDisplay(activeFilters);
  }

  updateActiveFiltersDisplay(activeFilters) {
    const activeFiltersContainer = document.querySelector('.active-filters');
    if (!activeFiltersContainer) return;

    if (Object.keys(activeFilters).length === 0) {
      activeFiltersContainer.innerHTML = '';
      return;
    }

    const filtersHTML = Object.entries(activeFilters)
      .map(
        ([key, value]) => `
              <span class="filter-tag">
                  ${this.getFilterLabel(key)}: ${this.getFilterValue(
          key,
          value
        )}
                  <button type="button" class="filter-tag-remove" data-filter="${key}">
                      <i class="fas fa-times"></i>
                  </button>
              </span>
          `
      )
      .join('');

    activeFiltersContainer.innerHTML = filtersHTML;

    // Agregar event listeners para remover filtros
    const removeButtons =
      activeFiltersContainer.querySelectorAll('.filter-tag-remove');
    removeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filterKey = button.dataset.filter;
        this.filters[filterKey] = '';
        const filterInput = this.element.querySelector(`[name="${filterKey}"]`);
        if (filterInput) filterInput.value = '';
        this.applyFilters();
      });
    });
  }

  getFilterLabel(key) {
    const labels = {
      jobType: 'Tipo de trabajo',
      salary: 'Salario',
      location: 'Ubicación',
      experience: 'Experiencia',
      date: 'Fecha',
    };
    return labels[key] || key;
  }

  getFilterValue(key, value) {
    // Convertir valores de filtro a texto legible
    const valueMappers = {
      jobType: {
        FULL_TIME: 'Tiempo completo',
        PART_TIME: 'Medio tiempo',
        CONTRACT: 'Contrato',
        TEMPORARY: 'Temporal',
      },
      date: {
        today: 'Hoy',
        week: 'Última semana',
        month: 'Último mes',
      },
    };

    return valueMappers[key]?.[value] || value;
  }
}

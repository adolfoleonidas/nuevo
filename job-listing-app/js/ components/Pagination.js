// js/components/Pagination.js
export class Pagination {
  constructor(config = {}) {
    // Configuración inicial
    this.config = {
      container: config.container || '.pagination-container',
      itemsPerPage: config.itemsPerPage || 10,
      maxPagesVisible: config.maxPagesVisible || 5,
      currentPage: config.currentPage || 1,
      totalItems: config.totalItems || 0,
      onPageChange: config.onPageChange || (() => {}),
      labels: {
        prev: 'Anterior',
        next: 'Siguiente',
        first: 'Primera página',
        last: 'Última página',
      },
    };

    this.init();
  }

  init() {
    // Inicializar el contenedor
    this.container = document.querySelector(this.config.container);
    if (!this.container) {
      console.error('No se encontró el contenedor de paginación');
      return;
    }

    // Renderizar estado inicial
    this.render();
    // Configurar eventos
    this.setupEventListeners();
  }

  calculateTotalPages() {
    return Math.ceil(this.config.totalItems / this.config.itemsPerPage);
  }

  getVisiblePages() {
    const totalPages = this.calculateTotalPages();
    const maxVisible = this.config.maxPagesVisible;
    const currentPage = this.config.currentPage;

    let pages = [];
    let startPage, endPage;

    if (totalPages <= maxVisible) {
      // Caso 1: Total de páginas es menor que el máximo visible
      startPage = 1;
      endPage = totalPages;
    } else {
      // Caso 2: Total de páginas es mayor que el máximo visible
      const halfVisible = Math.floor(maxVisible / 2);

      if (currentPage <= halfVisible) {
        // Cerca del inicio
        startPage = 1;
        endPage = maxVisible;
      } else if (currentPage + halfVisible >= totalPages) {
        // Cerca del final
        startPage = totalPages - maxVisible + 1;
        endPage = totalPages;
      } else {
        // En medio
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    // Generar array de páginas
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  render() {
    const totalPages = this.calculateTotalPages();
    if (totalPages <= 1) {
      this.container.innerHTML = '';
      return;
    }

    const visiblePages = this.getVisiblePages();
    const currentPage = this.config.currentPage;

    const html = `
          <nav class="pagination" role="navigation" aria-label="Navegación de páginas">
              <ul class="pagination__list">
                  <!-- Botón Anterior -->
                  <li class="pagination__item">
                      <button 
                          class="pagination__link pagination__link--prev ${
                            currentPage === 1 ? 'disabled' : ''
                          }"
                          ${currentPage === 1 ? 'disabled' : ''}
                          aria-label="${this.config.labels.prev}"
                          data-page="${currentPage - 1}"
                      >
                          <i class="fas fa-chevron-left"></i>
                          <span class="pagination__text">${
                            this.config.labels.prev
                          }</span>
                      </button>
                  </li>

                  <!-- Primera página si no es visible -->
                  ${
                    visiblePages[0] > 1
                      ? `
                      <li class="pagination__item">
                          <button 
                              class="pagination__link" 
                              data-page="1"
                              aria-label="${this.config.labels.first}"
                          >1</button>
                      </li>
                      ${
                        visiblePages[0] > 2
                          ? `
                          <li class="pagination__item pagination__ellipsis">
                              <span>&hellip;</span>
                          </li>
                      `
                          : ''
                      }
                  `
                      : ''
                  }

                  <!-- Páginas visibles -->
                  ${visiblePages
                    .map(
                      (page) => `
                      <li class="pagination__item">
                          <button 
                              class="pagination__link ${
                                page === currentPage ? 'active' : ''
                              }"
                              data-page="${page}"
                              aria-label="Página ${page}"
                              ${
                                page === currentPage
                                  ? 'aria-current="page"'
                                  : ''
                              }
                          >${page}</button>
                      </li>
                  `
                    )
                    .join('')}

                  <!-- Última página si no es visible -->
                  ${
                    visiblePages[visiblePages.length - 1] < totalPages
                      ? `
                      ${
                        visiblePages[visiblePages.length - 1] < totalPages - 1
                          ? `
                          <li class="pagination__item pagination__ellipsis">
                              <span>&hellip;</span>
                          </li>
                      `
                          : ''
                      }
                      <li class="pagination__item">
                          <button 
                              class="pagination__link" 
                              data-page="${totalPages}"
                              aria-label="${this.config.labels.last}"
                          >${totalPages}</button>
                      </li>
                  `
                      : ''
                  }

                  <!-- Botón Siguiente -->
                  <li class="pagination__item">
                      <button 
                          class="pagination__link pagination__link--next ${
                            currentPage === totalPages ? 'disabled' : ''
                          }"
                          ${currentPage === totalPages ? 'disabled' : ''}
                          aria-label="${this.config.labels.next}"
                          data-page="${currentPage + 1}"
                      >
                          <span class="pagination__text">${
                            this.config.labels.next
                          }</span>
                          <i class="fas fa-chevron-right"></i>
                      </button>
                  </li>
              </ul>

              <!-- Información de página actual -->
              <div class="pagination__info" aria-live="polite">
                  Página ${currentPage} de ${totalPages}
              </div>
          </nav>
      `;

    this.container.innerHTML = html;
  }

  setupEventListeners() {
    this.container.addEventListener('click', (e) => {
      const button = e.target.closest('.pagination__link');
      if (!button || button.disabled) return;

      const newPage = parseInt(button.dataset.page);
      if (newPage !== this.config.currentPage) {
        this.goToPage(newPage);
      }
    });
  }

  goToPage(page) {
    const totalPages = this.calculateTotalPages();
    if (page < 1 || page > totalPages) return;

    this.config.currentPage = page;
    this.render();
    this.config.onPageChange(page);
    this.announcePageChange(page, totalPages);
  }

  announcePageChange(page, totalPages) {
    const announcement = document.createElement('div');
    announcement.className = 'sr-only';
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Navegado a página ${page} de ${totalPages}`;

    this.container.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    this.render();
  }
}

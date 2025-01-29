// js/components/SearchBar.js
export class SearchBar {
  constructor(config) {
    this.onSearch = config.onSearch;
    this.init();
  }

  init() {
    this.element = document.querySelector('.search-bar');
    this.setupEventListeners();
  }

  setupEventListeners() {
    const form = this.element.querySelector('form');
    form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchParams = Object.fromEntries(formData);
    this.onSearch(searchParams);
  }
}

// js/components/JobList.js
export class JobList {
  constructor(config) {
    this.onJobSelect = config.onJobSelect;
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.init();
  }

  init() {
    this.element = document.querySelector('.jobs-list');
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.element.addEventListener('click', this.handleJobClick.bind(this));
  }

  handleJobClick(event) {
    const jobCard = event.target.closest('.job-card');
    if (jobCard) {
      const jobId = jobCard.dataset.jobId;
      this.onJobSelect(jobId);
    }
  }

  renderJobs(jobs) {
    this.element.innerHTML = jobs
      .map((job) => this.createJobCard(job))
      .join('');
  }

  createJobCard(job) {
    return `
          <article class="job-card" data-job-id="${job.id}">
              <div class="job-card__header">
                  <img 
                      class="job-card__company-logo" 
                      src="${job.company.logo}" 
                      alt="${job.company.name} logo"
                  >
                  <div>
                      <h3 class="job-card__title">${job.title}</h3>
                      <p class="job-card__company">${job.company.name}</p>
                  </div>
              </div>
              <div class="job-card__meta">
                  <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                  <span><i class="fas fa-money-bill-wave"></i> ${job.salary}</span>
                  <span><i class="fas fa-clock"></i> ${job.type}</span>
              </div>
          </article>
      `;
  }
}

// js/components/Modal.js
export class Modal {
  constructor() {
    this.init();
  }

  init() {
    this.element = document.querySelector('.modal');
    this.content = this.element.querySelector('.modal__content');
    this.setupEventListeners();
  }

  setupEventListeners() {
    const closeBtn = this.element.querySelector('.modal__close');
    closeBtn.addEventListener('click', () => this.hide());

    this.element.addEventListener('click', (e) => {
      if (e.target === this.element) this.hide();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isVisible()) this.hide();
    });
  }

  show(content) {
    this.content.innerHTML = content;
    this.element.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.element.classList.remove('active');
    document.body.style.overflow = '';
  }

  isVisible() {
    return this.element.classList.contains('active');
  }
}

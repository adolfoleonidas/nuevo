// Import shared data and utilities
import { jobsData, handleImageError } from './main.js';

// Job List Component
class JobListComponent {
  constructor() {
    this.jobsList = document.getElementById('jobsList');
    this.prevButton = document.getElementById('prevPage');
    this.nextButton = document.getElementById('nextPage');
    this.pageInfo = document.getElementById('pageInfo');
    this.searchInput = document.getElementById('searchInput');

    this.currentPage = 1;
    this.perPage = 5;
    this.filteredJobs = [...jobsData];

    this.initEventListeners();
    this.displayJobs();
  }

  initEventListeners() {
    // Search functionality
    this.searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value;
      this.filteredJobs = this.filterJobs(searchTerm);
      this.currentPage = 1;
      this.displayJobs();
    });

    // Pagination
    this.prevButton.addEventListener('click', () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.displayJobs();
      }
    });

    this.nextButton.addEventListener('click', () => {
      if (this.currentPage < this.getTotalPages()) {
        this.currentPage++;
        this.displayJobs();
      }
    });

    // Job card click event
    this.jobsList.addEventListener('click', (e) => {
      const jobCard = e.target.closest('.job-card');
      if (jobCard) {
        this.selectJob(jobCard);
      }
    });
  }

  filterJobs(searchTerm) {
    return jobsData.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  displayJobs() {
    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    const paginatedJobs = this.filteredJobs.slice(start, end);

    this.jobsList.innerHTML = '';

    paginatedJobs.forEach((job) => {
      const jobCard = this.createJobCard(job);
      this.jobsList.appendChild(jobCard);
    });

    this.updatePagination();
  }

  createJobCard(job) {
    const template = document.getElementById('jobCardTemplate');
    const card = template.content.cloneNode(true);

    // Populate job card data
    const companyLogo = card.querySelector('.company-logo img');
    companyLogo.src = job.company.logo;
    companyLogo.alt = job.company.name;
    companyLogo.onerror = () => handleImageError(companyLogo, job.company.name);

    card.querySelector('.company-name-text').textContent = job.company.name;
    card.querySelector('.rating').textContent = job.company.rating;
    card.querySelector('.location').textContent = job.company.location;
    card.querySelector('.job-title').textContent = job.title;
    card.querySelector('.salary').textContent = job.salary;
    card.querySelector('.contract-type').textContent = job.contractType;

    const jobCard = card.querySelector('.job-card');
    jobCard.setAttribute('data-job-id', job.id);

    return jobCard;
  }

  selectJob(jobCard) {
    // Remove active class from all job cards
    document.querySelectorAll('.job-card').forEach((card) => {
      card.classList.remove('active');
    });
    jobCard.classList.add('active');

    // Trigger job detail display
    const jobId = parseInt(jobCard.getAttribute('data-job-id'));
    const job = jobsData.find((j) => j.id === jobId);

    // Dispatch custom event for job selection
    const event = new CustomEvent('jobSelected', {
      detail: { job },
      bubbles: true,
    });
    jobCard.dispatchEvent(event);
  }

  getTotalPages() {
    return Math.ceil(this.filteredJobs.length / this.perPage);
  }

  updatePagination() {
    const totalPages = this.getTotalPages();

    this.prevButton.disabled = this.currentPage === 1;
    this.nextButton.disabled = this.currentPage === totalPages;
    this.pageInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
  }
}

// Initialize job list component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new JobListComponent();
});

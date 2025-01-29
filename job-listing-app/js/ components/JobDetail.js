// Import shared data and utilities
import { handleImageError } from './main.js';

// Job Detail Component
class JobDetailComponent {
  constructor() {
    this.jobDetailContainer = document.getElementById('jobDetailContainer');

    this.initEventListeners();
  }

  initEventListeners() {
    // Listen for job selection event
    document.addEventListener('jobSelected', (e) => {
      const job = e.detail.job;
      this.displayJobDetail(job);
    });

    // Responsive handling for mobile/desktop
    this.handleResponsiveDisplay();
  }

  handleResponsiveDisplay() {
    const jobDetailContainer = document.getElementById('jobDetailContainer');
    const jobModal = document.getElementById('jobModal');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    // Check screen width and adjust display
    const checkScreenSize = () => {
      if (window.innerWidth <= 1024) {
        // Mobile view - use modal
        jobDetailContainer.innerHTML = '';
      } else {
        // Desktop view - use sidebar
        jobModal.classList.remove('active');
      }
    };

    // Initial check and add resize listener
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Modal close event
    modalClose.addEventListener('click', () => {
      jobModal.classList.remove('active');
    });
  }

  displayJobDetail(job) {
    const template = document.getElementById('jobDetailTemplate');
    const detail = template.content.cloneNode(true);

    // Company Logo
    const companyLogo = detail.querySelector('.company-logo img');
    companyLogo.src = job.company.logo;
    companyLogo.alt = job.company.name;
    companyLogo.onerror = () => handleImageError(companyLogo, job.company.name);

    // Company Information
    detail.querySelector('.company-name-text').textContent = job.company.name;
    detail.querySelector('.rating').textContent = job.company.rating;
    detail.querySelector('.employees').textContent = job.company.employees;
    detail.querySelector('.location').textContent = job.company.location;

    // Job Details
    detail.querySelector('.job-title').textContent = job.title;
    detail.querySelector('.salary').textContent = job.salary;
    detail.querySelector('.contract-type').textContent = job.contractType;
    detail.querySelector('.schedule').textContent = job.schedule;
    detail.querySelector('.duration').textContent = job.duration;
    detail.querySelector('.job-description').textContent = job.description;

    // Requirements
    const requirementsList = detail.querySelector('.requirements-list');
    requirementsList.innerHTML = ''; // Clear previous contents
    job.requirements.forEach((req) => {
      const li = document.createElement('li');
      li.className = 'requirement-item';
      li.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${req}</span>
            `;
      requirementsList.appendChild(li);
    });

    // Benefits
    const benefitsList = detail.querySelector('.benefits-list');
    benefitsList.innerHTML = ''; // Clear previous contents
    job.benefits.forEach((benefit) => {
      const li = document.createElement('li');
      li.className = 'benefit-item';
      li.innerHTML = `
                <i class="fas fa-check"></i>
                <span>${benefit}</span>
            `;
      benefitsList.appendChild(li);
    });

    // Determine display method based on screen size
    if (window.innerWidth <= 1024) {
      // Mobile - show in modal
      const jobModal = document.getElementById('jobModal');
      const modalContent = document.getElementById('modalContent');

      modalContent.innerHTML = '';
      modalContent.appendChild(detail);
      jobModal.classList.add('active');
    } else {
      // Desktop - show in sidebar
      this.jobDetailContainer.innerHTML = '';
      this.jobDetailContainer.appendChild(detail);
    }
  }
}

// Initialize job detail component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new JobDetailComponent();
});

// Modal Component
class ModalComponent {
  constructor() {
    this.modal = document.getElementById('jobModal');
    this.modalContent = document.getElementById('modalContent');
    this.modalClose = document.getElementById('modalClose');

    this.initEventListeners();
  }

  initEventListeners() {
    // Close modal when close button is clicked
    this.modalClose.addEventListener('click', () => this.closeModal());

    // Close modal when clicking outside the modal content
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });

    // Close modal on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  openModal(content) {
    this.modalContent.innerHTML = '';

    // If content is a string, set as innerHTML
    if (typeof content === 'string') {
      this.modalContent.innerHTML = content;
    }
    // If content is a Node, append it
    else if (content instanceof Node) {
      this.modalContent.appendChild(content);
    }

    this.modal.classList.add('active');
  }

  closeModal() {
    this.modal.classList.remove('active');
    this.modalContent.innerHTML = '';
  }
}

// Initialize modal component when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ModalComponent();
});

// Import other module scripts
import './hero.js';
import './job-list.js';
import './job-detail.js';
import './modal.js';

// Sample job data (consider moving to a separate data file)
export const jobsData = [
    {
        id: 1,
        company: {
            name: "Los Medanos",
            logo: "https://example.com/logo.png",
            rating: "4,3",
            employees: "500+",
            location: "Subtanjalla, Ica",
            verified: true
        },
        title: "Asesor de ventas con o sin experiencia",
        salary: "S/ 1.025,00 · Mensual",
        contractType: "Jornal y destajo",
        schedule: "Tiempo Completo",
        duration: "3 meses",
        description: "Nos encontramos en búsqueda de los mejores talentos para unirse a nuestro equipo de ventas...",
        requirements: [
            "Experiencia mínima de 1 año en ventas (deseable)",
            "Estudios técnicos o universitarios (en curso o concluidos)",
            "Manejo de herramientas office a nivel usuario",
            "Disponibilidad para trabajo remoto"
        ],
        benefits: [
            "Sueldo base + comisiones sin tope",
            "Capacitación constante",
            "Desarrollo de línea de carrera",
            "Seguro de salud desde el primer día"
        ]
    },
    // Add more job objects as needed
];

// Utility function to handle image errors
export function handleImageError(img, companyName) {
    img.style.display = 'none';
    const initials = companyName
        .split(' ')
        .map(word =>.map(word => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    img.parentNode.textContent = initials;
}
import { loadHeaderFooter } from "./utils.mjs";
import { fetchRandomMovie } from "./ExternalServices.mjs";

// Function to initialize common elements
export async function initializeCommon() {
    try {
        // Load header and footer
        const success = await loadHeaderFooter();
        if (!success) {
            console.error('Failed to load header and footer');
            return;
        }

        // Add event listeners for the hamburger menu
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav-menu');

        if (hamburger && nav) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                nav.classList.toggle('active');
                document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking on a link
            const navLinks = nav.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });
        }

        // Add event listener for the "surprise me" button
        const surpriseMeButton = document.getElementById('surprise-me');
        if (surpriseMeButton) {
            surpriseMeButton.addEventListener('click', (e) => {
                e.preventDefault();
                fetchRandomMovie();
            });
        }
    } catch (error) {
        console.error('Error initializing common functionality:', error);
    }
}

// Initialize common elements when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCommon); 
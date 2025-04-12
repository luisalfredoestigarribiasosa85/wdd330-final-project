import { loadHeaderFooter, fetchRandomMovie } from './utils.mjs';

// Function to initialize common elements
export function initializeCommon() {
    // Load header and footer
    loadHeaderFooter().then(() => {
        // Add event listeners after header is loaded
        const hamburger = document.getElementById('hamburger');
        const nav = document.querySelector('.nav-menu');

        if (hamburger && nav) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                nav.classList.toggle('show');
                // Prevent scrolling when menu is open
                document.body.style.overflow = nav.classList.contains('show') ? 'hidden' : '';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('show')) {
                    nav.classList.remove('show');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Close menu when clicking on a link
            nav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('show');
                    hamburger.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Add event listener for surprise me button
            const surpriseMeButton = document.getElementById('surprise-me');
            if (surpriseMeButton) {
                surpriseMeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    fetchRandomMovie();
                });
            }
        }
    });
}

// Initialize common elements when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCommon); 
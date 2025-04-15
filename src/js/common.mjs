import { fetchRandomMovie } from "./utils.mjs";

async function loadHeaderFooter() {
    try {
        const headerContainer = document.getElementById("header");
        const footerContainer = document.getElementById("footer");

        if (!headerContainer || !footerContainer) {
            console.error('Header or footer container not found');
            return false;
        }

        // Load header
        const headerResponse = await fetch('/partials/header.html');
        if (!headerResponse.ok) {
            throw new Error(`Failed to load header: ${headerResponse.status}`);
        }
        const headerText = await headerResponse.text();
        headerContainer.innerHTML = headerText;

        // Load footer
        const footerResponse = await fetch('/partials/footer.html');
        if (!footerResponse.ok) {
            throw new Error(`Failed to load footer: ${footerResponse.status}`);
        }
        const footerText = await footerResponse.text();
        footerContainer.innerHTML = footerText;

        return true;
    } catch (error) {
        console.error('Error in loadHeaderFooter:', error);
        return false;
    }
}

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
                document.body.classList.toggle('menu-open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu when clicking on a link or button
            const navItems = nav.querySelectorAll('a, button');
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    nav.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        // Wait a short moment for the DOM to update after loading the header
        await new Promise(resolve => setTimeout(resolve, 100));

        // Add event listener for the "surprise me" button
        const surpriseMeButton = document.getElementById('surprise-me');
        if (surpriseMeButton) {
            console.log('Setting up surprise me button');
            surpriseMeButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Surprise me button clicked');
                try {
                    await fetchRandomMovie();
                } catch (error) {
                    console.error('Error fetching random movie:', error);
                    alert('Failed to get a random movie. Please try again.');
                }
            });
        } else {
            console.warn('Surprise me button not found - this is expected on some pages');
        }
    } catch (error) {
        console.error('Error initializing common functionality:', error);
    }
}
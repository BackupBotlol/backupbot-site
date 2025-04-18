document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initDarkMode();
    initFAQAccordion();
    initAnimatedCounters();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
    initSearchFeature();
    initLazyLoading();
    initTooltips();
    checkForLocalStorageConsent();
});

function initNavigation() {
    const nav = document.getElementById('mainNav');
    
    if (!nav) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let currentSection = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-indigo-600');
            link.classList.add('text-gray-700');
            
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-indigo-600');
            }
        });
    });
}

function initDarkMode() {
    const darkModeToggleDesktop = document.getElementById('darkModeToggleDesktop');
    const darkModeToggleMobile = document.getElementById('darkModeToggleMobile');
    
    if (!darkModeToggleDesktop || !darkModeToggleMobile) return;
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme === 'dark' || (!storedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        updateDarkModeIcons(true);
    }
    
    function toggleDarkMode() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        updateDarkModeIcons(isDarkMode);
    }
    
    function updateDarkModeIcons(isDarkMode) {
        const desktopIcon = darkModeToggleDesktop.querySelector('.toggle-circle i');
        const mobileIcon = darkModeToggleMobile.querySelector('.toggle-circle i');
        
        if (isDarkMode) {
            if (desktopIcon) {
                desktopIcon.classList.remove('fa-sun', 'text-yellow-500');
                desktopIcon.classList.add('fa-moon', 'text-blue-300');
            }
            if (mobileIcon) {
                mobileIcon.classList.remove('fa-sun', 'text-yellow-500');
                mobileIcon.classList.add('fa-moon', 'text-blue-300');
            }
        } else {
            if (desktopIcon) {
                desktopIcon.classList.remove('fa-moon', 'text-blue-300');
                desktopIcon.classList.add('fa-sun', 'text-yellow-500');
            }
            if (mobileIcon) {
                mobileIcon.classList.remove('fa-moon', 'text-blue-300');
                mobileIcon.classList.add('fa-sun', 'text-yellow-500');
            }
        }
    }
    
    darkModeToggleDesktop.addEventListener('click', toggleDarkMode);
    darkModeToggleMobile.addEventListener('click', toggleDarkMode);
    
    prefersDarkScheme.addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                updateDarkModeIcons(true);
            } else {
                document.body.classList.remove('dark-mode');
                updateDarkModeIcons(false);
            }
        }
    });
}

function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            if (!isOpen) {
                item.classList.add('active');
            }
        });
    });
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        const answer = item.querySelector('.faq-answer');
        const answerId = `faq-answer-${Math.random().toString(36).substring(2, 9)}`;
        answer.setAttribute('id', answerId);
        question.setAttribute('aria-controls', answerId);
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        item.addEventListener('toggle', () => {
            const isOpen = item.classList.contains('active');
            question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    });
}

function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-counter');
    
    if (counters.length === 0) return;
    
    function animateCounter(element, target, duration = 2000, startDelay = 500) {
        let start = 0;
        const startTime = Date.now() + startDelay;
        
        const updateCounter = () => {
            const now = Date.now();
            
            if (now < startTime) {
                requestAnimationFrame(updateCounter);
                return;
            }
            
            const elapsed = now - startTime;
            
            if (elapsed > duration) {
                element.textContent = target.toLocaleString();
                return;
            }
            
            const value = Math.floor((elapsed / duration) * target);
            
            if (value !== start) {
                element.textContent = value.toLocaleString();
                start = value;
            }
            
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                const targetValue = parseInt(counterElement.dataset.count || counterElement.textContent, 10);
                
                animateCounter(counterElement, targetValue);
                observer.unobserve(counterElement);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        if (!counter.dataset.count) {
            const targetValue = parseInt(counter.textContent, 10);
            counter.dataset.count = targetValue;
            counter.textContent = '0';
        }
        
        observer.observe(counter);
    });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
    
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    backToTopButton.setAttribute('tabindex', '0');
    backToTopButton.setAttribute('role', 'button');
    backToTopButton.setAttribute('aria-label', 'Scroll to top');
    
    backToTopButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            backToTopButton.click();
        }
    });
}

function initSmoothScroll() {
    const allLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
}

function initMobileMenu() {
    const menuButton = document.getElementById('menuButton');
    const closeMenu = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (!menuButton || !closeMenu || !mobileMenu || !menuOverlay) return;
    
    menuButton.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        menuButton.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
    });
    
    function closeMenuFunction() {
        mobileMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        menuButton.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
    }
    
    closeMenu.addEventListener('click', closeMenuFunction);
    menuOverlay.addEventListener('click', closeMenuFunction);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenuFunction();
        }
    });
    
    menuButton.setAttribute('aria-controls', 'mobileMenu');
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.setAttribute('role', 'dialog');
    mobileMenu.setAttribute('aria-modal', 'true');
    mobileMenu.setAttribute('aria-label', 'Site navigation');
}

function initSearchFeature() {
    const searchContainer = document.getElementById('searchContainer');
    
    if (!searchContainer) {
        const nav = document.querySelector('nav .container');
        
        if (!nav) return;
        
        const searchHTML = `
            <div id="searchContainer" class="hidden md:flex items-center relative mx-4">
                <div class="relative w-full">
                    <input type="text" id="searchInput" placeholder="Search commands..." class="form-input pr-10 py-2 w-full" aria-label="Search commands">
                    <button id="searchButton" class="absolute right-0 top-0 bottom-0 px-3 text-gray-500 hover:text-indigo-600">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div id="searchResults" class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 hidden">
                    <div class="max-h-96 overflow-y-auto p-2"></div>
                </div>
            </div>`;
        
        const darkModeToggle = nav.querySelector('.dark-mode-toggle');
        
        if (darkModeToggle) {
            darkModeToggle.parentElement.insertAdjacentHTML('beforebegin', searchHTML);
        } else {
            nav.insertAdjacentHTML('beforeend', searchHTML);
        }
    }
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchButton || !searchResults) return;
    
    const commandCards = document.querySelectorAll('.command-card');
    const commands = Array.from(commandCards).map(card => {
        const commandName = card.querySelector('h3').textContent;
        const commandDesc = card.querySelector('p').textContent;
        
        return {
            name: commandName,
            description: commandDesc,
            element: card
        };
    });
    
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.classList.add('hidden');
            return;
        }
        
        const results = commands.filter(cmd => 
            cmd.name.toLowerCase().includes(query.toLowerCase()) || 
            cmd.description.toLowerCase().includes(query.toLowerCase())
        );
        
        displayResults(results, query);
    }
    
    function displayResults(results, query) {
        const resultsContainer = searchResults.querySelector('div');
        resultsContainer.innerHTML = '';
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `<p class="text-gray-600 dark:text-gray-400 p-3">No commands found matching "${query}"</p>`;
            searchResults.classList.remove('hidden');
            return;
        }
        
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer';
            
            resultItem.innerHTML = `
                <h4 class="font-semibold">${highlightText(result.name, query)}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">${highlightText(result.description, query)}</p>
            `;
            
            resultItem.addEventListener('click', () => {
                result.element.scrollIntoView({ behavior: 'smooth' });
                
                result.element.classList.add('pulse-animation');
                setTimeout(() => {
                    result.element.classList.remove('pulse-animation');
                }, 2000);
                
                searchResults.classList.add('hidden');
                searchInput.value = '';
            });
            
            resultsContainer.appendChild(resultItem);
        });
        
        searchResults.classList.remove('hidden');
    }
    
    function highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="bg-yellow-200 dark:bg-yellow-700">$1</span>');
    }
    
    searchInput.addEventListener('input', () => {
        performSearch(searchInput.value);
    });
    
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.classList.add('hidden');
            searchInput.blur();
        }
    });
}

function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img:not([loading])');
        lazyImages.forEach(img => {
            img.setAttribute('loading', 'lazy');
        });
    } else {
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    
                    if (lazyImage.dataset.src) {
                        lazyImage.src = lazyImage.dataset.src;
                    }
                    
                    lazyImage.classList.remove('lazy');
                    observer.unobserve(lazyImage);
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('.lazy');
        lazyImages.forEach(lazyImage => {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    if (tooltipElements.length === 0) return;
    
    tooltipElements.forEach(element => {
        element.classList.add('tooltip');
    });
}

function checkForLocalStorageConsent() {
    if (localStorage.getItem('cookie-consent')) return;
    
    const consentBanner = document.createElement('div');
    consentBanner.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 flex flex-col md:flex-row items-center justify-between';
    consentBanner.id = 'cookie-consent';
    
    consentBanner.innerHTML = `
        <div class="mb-4 md:mb-0">
            <p class="text-gray-700 dark:text-gray-300">
                This website uses cookies to enhance your experience and enable features like dark mode preferences.
            </p>
        </div>
        <div class="flex space-x-4">
            <button id="cookie-accept" class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                Accept
            </button>
            <button id="cookie-decline" class="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Decline
            </button>
        </div>
    `;
    
    document.body.appendChild(consentBanner);
    
    document.getElementById('cookie-accept').addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        consentBanner.remove();
    });
    
    document.getElementById('cookie-decline').addEventListener('click', () => {
        sessionStorage.setItem('cookie-consent', 'declined');
        consentBanner.remove();
        
        localStorage.removeItem('theme');
    });
}

function addSkipToContentLink() {
    const mainContent = document.querySelector('main') || document.getElementById('features');
    
    if (!mainContent) return;
    
    if (!mainContent.id) {
        mainContent.id = 'main-content';
    }
    
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-to-content';
    skipLink.href = `#${mainContent.id}`;
    skipLink.textContent = 'Skip to content';
    
    document.body.prepend(skipLink);
}

addSkipToContentLink();

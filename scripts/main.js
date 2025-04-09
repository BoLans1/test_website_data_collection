// Main JavaScript file for Analytics Testing Playground

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize components
    initNavigation();
    initCookieConsent();
    initNewsletterForm();
    initDownloadTracking();
    initScrollTracking();
    initExternalLinkTracking();

    // Initialize specific page components if they exist
    if (document.querySelector('.carousel')) {
        initCarousel();
    }

    if (document.querySelector('.video-player')) {
        initVideoPlayer();
    }

    if (document.querySelector('.tabs')) {
        initTabs();
    }

    if (document.querySelector('.accordion')) {
        initAccordion();
    }

    if (document.querySelector('.range-slider')) {
        initRangeSliders();
    }

    if (document.querySelector('.star-rating')) {
        initStarRating();
    }

    if (document.querySelector('.color-options')) {
        initColorOptions();
    }

    if (document.querySelector('.quantity-selector')) {
        initQuantitySelectors();
    }

    if (document.querySelector('.tooltip-container')) {
        initTooltips();
    }

    if (document.querySelector('.modal-trigger')) {
        initModals();
    }

    if (document.querySelector('.progress-bar-horizontal')) {
        initProgressBars();
    }

    if (document.querySelector('.checkout-form')) {
        initCheckout();
    }

    // Add to cart functionality for product pages
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    if (addToCartButtons.length > 0) {
        initAddToCart();
    }
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Track navigation toggle event
            trackEvent('navigation', 'toggle_menu', navLinks.classList.contains('active') ? 'open' : 'close');
        });
    }

    // Track navigation clicks
    const navItems = document.querySelectorAll('[data-nav-item]');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const navSection = this.getAttribute('data-nav-item');
            trackEvent('navigation', 'click', navSection);
        });
    });

    // Track footer link clicks
    const footerLinks = document.querySelectorAll('[data-footer-link]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function () {
            const linkSection = this.getAttribute('data-footer-link');
            trackEvent('footer', 'click', linkSection);
        });
    });
}

// Cookie consent functionality
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieSettings = document.getElementById('cookie-settings');
    const acceptCookies = document.getElementById('accept-cookies');
    const rejectCookies = document.getElementById('reject-cookies');
    const customizeCookies = document.getElementById('customize-cookies');
    const savePreferences = document.getElementById('save-preferences');
    const closeSettings = document.getElementById('close-settings');

    // Check if cookie preferences are already set
    if (!localStorage.getItem('cookiePreferences')) {
        // Show cookie banner after a short delay
        setTimeout(() => {
            if (cookieBanner) {
                cookieBanner.style.display = 'block';
                trackEvent('cookie_banner', 'impression', 'initial_display');
            }
        }, 1000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', function () {
            acceptAllCookies();
            cookieBanner.style.display = 'none';
            trackEvent('cookie_banner', 'click', 'accept_all');
        });
    }

    if (rejectCookies) {
        rejectCookies.addEventListener('click', function () {
            rejectNonEssentialCookies();
            cookieBanner.style.display = 'none';
            trackEvent('cookie_banner', 'click', 'reject_non_essential');
        });
    }

    if (customizeCookies) {
        customizeCookies.addEventListener('click', function () {
            cookieBanner.style.display = 'none';
            cookieSettings.style.display = 'flex';
            trackEvent('cookie_banner', 'click', 'customize');
        });
    }

    if (savePreferences) {
        savePreferences.addEventListener('click', function () {
            saveCookiePreferences();
            cookieSettings.style.display = 'none';
            trackEvent('cookie_settings', 'click', 'save_preferences');
        });
    }

    if (closeSettings) {
        closeSettings.addEventListener('click', function () {
            cookieSettings.style.display = 'none';
            trackEvent('cookie_settings', 'click', 'close');
        });
    }
}

function acceptAllCookies() {
    const preferences = {
        essential: true,
        analytics: true,
        marketing: true,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

    // Update checkbox states
    document.getElementById('analytics-cookies').checked = true;
    document.getElementById('marketing-cookies').checked = true;
}

function rejectNonEssentialCookies() {
    const preferences = {
        essential: true,
        analytics: false,
        marketing: false,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));

    // Update checkbox states
    document.getElementById('analytics-cookies').checked = false;
    document.getElementById('marketing-cookies').checked = false;
}

function saveCookiePreferences() {
    const analyticsConsent = document.getElementById('analytics-cookies').checked;
    const marketingConsent = document.getElementById('marketing-cookies').checked;

    const preferences = {
        essential: true,
        analytics: analyticsConsent,
        marketing: marketingConsent,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterConfirmation = document.getElementById('newsletter-confirmation');
    const closePopup = document.getElementById('close-popup');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('newsletter-email').value;
            const consent = document.getElementById('newsletter-consent').checked;

            // Simulate form submission
            console.log('Newsletter subscription:', { email, consent });

            // Track form submission
            trackEvent('newsletter', 'submit', email);

            // Show confirmation
            if (newsletterConfirmation) {
                newsletterConfirmation.style.display = 'flex';
            }

            // Reset form
            this.reset();
        });
    }

    if (closePopup) {
        closePopup.addEventListener('click', function () {
            newsletterConfirmation.style.display = 'none';
        });
    }
}

// Download tracking
function initDownloadTracking() {
    const downloadLinks = document.querySelectorAll('[data-download-type]');

    downloadLinks.forEach(link => {
        link.addEventListener('click', function () {
            const downloadType = this.getAttribute('data-download-type');
            const downloadUrl = this.getAttribute('href');

            trackEvent('download', downloadType, downloadUrl);
        });
    });
}

// Scroll depth tracking
function initScrollTracking() {
    let scrollMarks = [25, 50, 75, 100];
    let marks = new Set();

    window.addEventListener('scroll', function () {
        const scrollPercentage = calculateScrollPercentage();

        scrollMarks.forEach(mark => {
            if (scrollPercentage >= mark && !marks.has(mark)) {
                marks.add(mark);
                trackEvent('scroll_depth', 'scroll', `${mark}%`);
            }
        });
    });
}

function calculateScrollPercentage() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return Math.floor((scrollTop / (documentHeight - windowHeight)) * 100);
}

// External link tracking
function initExternalLinkTracking() {
    const externalLinks = document.querySelectorAll('[data-external-link]');

    externalLinks.forEach(link => {
        link.addEventListener('click', function () {
            const linkType = this.getAttribute('data-external-link');
            const linkUrl = this.getAttribute('href');

            trackEvent('external_link', linkType, linkUrl);
        });
    });
}

// Carousel functionality
function initCarousel() {
    const carousel = document.querySelector('.carousel');
    const carouselInner = carousel.querySelector('.carousel-inner');
    const carouselItems = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.prev');
    const nextBtn = carousel.querySelector('.next');
    const indicators = carousel.querySelectorAll('.carousel-indicator');

    let currentIndex = 0;
    const itemCount = carouselItems.length;

    // Set initial state
    updateCarousel();

    // Event listeners for controls
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            currentIndex = (currentIndex - 1 + itemCount) % itemCount;
            updateCarousel();
            trackEvent('carousel', 'click', 'previous');
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            currentIndex = (currentIndex + 1) % itemCount;
            updateCarousel();
            trackEvent('carousel', 'click', 'next');
        });
    }

    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function () {
            currentIndex = index;
            updateCarousel();
            trackEvent('carousel', 'click', `indicator_${index}`);
        });
    });

    function updateCarousel() {
        // Update carousel position
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Auto-advance carousel
    setInterval(() => {
        currentIndex = (currentIndex + 1) % itemCount;
        updateCarousel();
    }, 5000);
}

// Video player functionality
function initVideoPlayer() {
    const videoPlayer = document.querySelector('.video-player');
    const video = videoPlayer.querySelector('video');
    const playBtn = videoPlayer.querySelector('.play-pause');
    const muteBtn = videoPlayer.querySelector('.mute');
    const fullscreenBtn = videoPlayer.querySelector('.fullscreen');
    const progress = videoPlayer.querySelector('.progress');
    const progressBar = videoPlayer.querySelector('.progress-bar');

    let isPlaying = false;
    let isMuted = false;

    // Play/Pause functionality
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }

    if (video) {
        video.addEventListener('click', togglePlay);

        // Update progress bar
        video.addEventListener('timeupdate', updateProgress);

        // Track video events
        video.addEventListener('play', function () {
            trackEvent('video', 'play', video.currentSrc);
        });

        video.addEventListener('pause', function () {
            trackEvent('video', 'pause', `${video.currentSrc} at ${Math.floor(video.currentTime)}s`);
        });

        video.addEventListener('ended', function () {
            trackEvent('video', 'complete', video.currentSrc);
        });
    }

    // Mute functionality
    if (muteBtn) {
        muteBtn.addEventListener('click', function () {
            isMuted = !isMuted;
            video.muted = isMuted;
            muteBtn.textContent = isMuted ? '🔇' : '🔊';
            trackEvent('video', isMuted ? 'mute' : 'unmute', video.currentSrc);
        });
    }

    // Fullscreen functionality
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function () {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) {
                video.msRequestFullscreen();
            }
            trackEvent('video', 'fullscreen', video.currentSrc);
        });
    }

    // Progress bar functionality
    if (progressBar) {
        progressBar.addEventListener('click', function (e) {
            const progressTime = (e.offsetX / progressBar.offsetWidth) * video.duration;
            video.currentTime = progressTime;
            trackEvent('video', 'seek', `${video.currentSrc} to ${Math.floor(progressTime)}s`);
        });
    }

    function togglePlay() {
        if (isPlaying) {
            video.pause();
            playBtn.textContent = '▶️';
        } else {
            video.play();
            playBtn.textContent = '⏸️';
        }
        isPlaying = !isPlaying;
    }

    function updateProgress() {
        if (progress && video.duration) {
            const percentage = (video.currentTime / video.duration) * 100;
            progress.style.width = `${percentage}%`;
        }
    }
}

// Tab functionality
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs');

    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll('.tab-nav button');
        const tabContents = container.querySelectorAll('.tab-content');

        tabButtons.forEach((button, index) => {
            button.addEventListener('click', function () {
                // Deactivate all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Activate clicked tab
                button.classList.add('active');
                tabContents[index].classList.add('active');

                // Track tab change
                trackEvent('tabs', 'change', button.textContent);
            });
        });

        // Activate first tab by default
        if (tabButtons.length > 0 && tabContents.length > 0) {
            tabButtons[0].classList.add('active');
            tabContents[0].classList.add('active');
        }
    });
}

// Accordion functionality
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');

        header.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

            // Close all accordion items
            accordionItems.forEach(accItem => {
                accItem.classList.remove('active');
            });

            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                trackEvent('accordion', 'open', header.textContent);
            } else {
                trackEvent('accordion', 'close', header.textContent);
            }
        });
    });
}

// Range slider functionality
function initRangeSliders() {
    const rangeSliders = document.querySelectorAll('.range-slider');

    rangeSliders.forEach(slider => {
        const input = slider.querySelector('input');
        const valueDisplay = slider.querySelector('.range-value');

        if (input && valueDisplay) {
            // Set initial value
            valueDisplay.textContent = input.value;

            // Update value on change
            input.addEventListener('input', function () {
                valueDisplay.textContent = this.value;
            });

            // Track final value when user stops sliding
            input.addEventListener('change', function () {
                trackEvent('range_slider', 'change', `${input.name}: ${this.value}`);
            });
        }
    });
}

// Star rating functionality
function initStarRating() {
    const starRatings = document.querySelectorAll('.star-rating');

    starRatings.forEach(container => {
        const stars = container.querySelectorAll('.star');

        stars.forEach((star, index) => {
            // Hover effect
            star.addEventListener('mouseover', function () {
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('active');
                }
            });

            star.addEventListener('mouseout', function () {
                stars.forEach(s => {
                    if (!s.classList.contains('selected')) {
                        s.classList.remove('active');
                    }
                });
            });

            // Click to rate
            star.addEventListener('click', function () {
                // Remove all selected and active states
                stars.forEach(s => {
                    s.classList.remove('selected');
                    s.classList.remove('active');
                });

                // Add selected state to clicked star and all before it
                for (let i = 0; i <= index; i++) {
                    stars[i].classList.add('selected');
                    stars[i].classList.add('active');
                }

                // Track rating
                trackEvent('star_rating', 'rate', `${index + 1} stars`);
            });
        });
    });
}

// Color options functionality
function initColorOptions() {
    const colorOptionContainers = document.querySelectorAll('.color-options');

    colorOptionContainers.forEach(container => {
        const colorOptions = container.querySelectorAll('.color-option');

        colorOptions.forEach(option => {
            option.addEventListener('click', function () {
                // Remove selected class from all options
                colorOptions.forEach(opt => opt.classList.remove('selected'));

                // Add selected class to clicked option
                option.classList.add('selected');

                // Get color value
                const colorValue = option.getAttribute('data-color');

                // Track color selection
                trackEvent('color_selection', 'select', colorValue);
            });
        });
    });
}

// Quantity selector functionality
function initQuantitySelectors() {
    const quantitySelectors = document.querySelectorAll('.quantity-selector');

    quantitySelectors.forEach(selector => {
        const minusBtn = selector.querySelector('.minus');
        const plusBtn = selector.querySelector('.plus');
        const input = selector.querySelector('.quantity-input');
        const productId = selector.getAttribute('data-product-id');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', function () {
                let value = parseInt(input.value);
                if (value > 1) {
                    input.value = value - 1;
                    trackEvent('quantity_selector', 'decrease', `${productId}: ${input.value}`);
                }
            });

            plusBtn.addEventListener('click', function () {
                let value = parseInt(input.value);
                input.value = value + 1;
                trackEvent('quantity_selector', 'increase', `${productId}: ${input.value}`);
            });

            input.addEventListener('change', function () {
                let value = parseInt(input.value);
                if (value < 1) {
                    input.value = 1;
                }
                trackEvent('quantity_selector', 'manual_change', `${productId}: ${input.value}`);
            });
        }
    });
}

// Tooltip functionality
function initTooltips() {
    // Tooltips are handled via CSS
    // This function is a placeholder for any additional JavaScript functionality
    console.log('Tooltips initialized');
}

// Modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.add('active');
                trackEvent('modal', 'open', modalId);

                // Close modal when clicking close button
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function () {
                        modal.classList.remove('active');
                        trackEvent('modal', 'close', modalId);
                    });
                }

                // Close modal when clicking outside
                modal.addEventListener('click', function (e) {
                    if (e.target === modal) {
                        modal.classList.remove('active');
                        trackEvent('modal', 'close_outside', modalId);
                    }
                });
            }
        });
    });
}

// Progress bar functionality
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar-horizontal');

    // This is just for demo purposes
    progressBars.forEach(bar => {
        const targetValue = parseInt(bar.getAttribute('data-value'));

        // Animate progress bar
        let currentValue = 0;
        const interval = setInterval(() => {
            if (currentValue >= targetValue) {
                clearInterval(interval);
                trackEvent('progress_bar', 'complete', `${bar.getAttribute('data-id')}: ${targetValue}%`);
            } else {
                currentValue += 1;
                bar.style.width = `${currentValue}%`;
            }
        }, 20);
    });
}

// Add to cart functionality
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const productName = this.getAttribute('data-product-name');
            const productPrice = this.getAttribute('data-product-price');
            const quantity = document.querySelector(`.quantity-selector[data-product-id="${productId}"] .quantity-input`)?.value || 1;

            // Simulate adding to cart
            console.log('Added to cart:', { productId, productName, productPrice, quantity });

            // Track add to cart event
            trackEvent('ecommerce', 'add_to_cart', {
                product_id: productId,
                product_name: productName,
                price: productPrice,
                quantity: quantity
            });

            // Show confirmation message
            alert(`Added ${quantity} ${productName} to your cart!`);
        });
    });
}

// Checkout functionality
function initCheckout() {
    const checkoutForm = document.querySelector('.checkout-form');

    if (checkoutForm) {
        // Track step visibility
        const steps = document.querySelectorAll('.checkout-step');
        if (steps.length > 0) {
            trackEvent('checkout', 'view_step', steps[0].getAttribute('data-step'));
        }

        // Continue to next step buttons
        const continueButtons = document.querySelectorAll('.continue-btn');
        continueButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const currentStep = this.closest('.checkout-section');
                const nextStep = currentStep.nextElementSibling;

                if (nextStep) {
                    // Hide current step
                    currentStep.style.display = 'none';

                    // Show next step
                    nextStep.style.display = 'block';

                    // Update step indicators
                    const stepNumber = nextStep.getAttribute('data-step');
                    updateCheckoutSteps(stepNumber);

                    // Track step progression
                    trackEvent('checkout', 'continue_to_step', stepNumber);
                }
            });
        });

        // Back buttons
        const backButtons = document.querySelectorAll('.back-btn');
        backButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                const currentStep = this.closest('.checkout-section');
                const prevStep = currentStep.previousElementSibling;

                if (prevStep) {
                    // Hide current step
                    currentStep.style.display = 'none';

                    // Show previous step
                    prevStep.style.display = 'block';

                    // Update step indicators
                    const stepNumber = prevStep.getAttribute('data-step');
                    updateCheckoutSteps(stepNumber);

                    // Track step regression
                    trackEvent('checkout', 'back_to_step', stepNumber);
                }
            });
        });

        // Submit checkout
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const formValues = {};

            for (const [key, value] of formData.entries()) {
                formValues[key] = value;
            }

            // Simulate checkout submission
            console.log('Checkout submitted:', formValues);

            // Track checkout completion
            trackEvent('checkout', 'complete', JSON.stringify(formValues));

            // Show confirmation
            alert('Thank you for your order! This is a test environment, so no actual order has been placed.');

            // Redirect to confirmation page
            // window.location.href = 'confirmation.html';
        });
    }
}

function updateCheckoutSteps(currentStep) {
    const steps = document.querySelectorAll('.checkout-step');

    steps.forEach(step => {
        const stepNumber = step.getAttribute('data-step');

        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active');
            step.classList.remove('completed');
        }
    });
}

// Generic tracking function
function trackEvent(category, action, label) {
    // Check if analytics cookies are accepted
    const cookiePreferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{"essential":true,"analytics":false,"marketing":false}');

    if (!cookiePreferences.analytics) {
        console.log('Analytics tracking disabled by user preferences');
        return;
    }

    // Log the event to console (for debugging)
    console.log('Track Event:', { category, action, label });

    // If using Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }

    // If using Google Tag Manager dataLayer
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'custom_event',
            'event_category': category,
            'event_action': action,
            'event_label': label
        });
    }

    // You can add other analytics platforms here
}

document.addEventListener('DOMContentLoaded', function () {
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate form submission
            console.log('Contact form submitted');

            // Track form submission
            if (typeof trackEvent === 'function') {
                trackEvent('form', 'submit', 'contact_form');
            }

            // Show confirmation
            alert('Contact form submitted successfully! This is a test environment, so no actual data has been sent.');

            // Reset form
            this.reset();
        });
    }

    // Multi-step form navigation
    const multiStepForm = document.getElementById('multi-step-form');
    if (multiStepForm) {
        const nextButtons = multiStepForm.querySelectorAll('.next-step');
        const prevButtons = multiStepForm.querySelectorAll('.prev-step');
        const formSteps = multiStepForm.querySelectorAll('.form-step');

        nextButtons.forEach(button => {
            button.addEventListener('click', function () {
                const currentStep = this.closest('.form-step');
                const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
                const nextStep = multiStepForm.querySelector(`.form-step[data-step="${currentStepNum + 1}"]`);

                if (nextStep) {
                    // Hide current step
                    currentStep.style.display = 'none';

                    // Show next step
                    nextStep.style.display = 'block';

                    // Track step progression
                    if (typeof trackEvent === 'function') {
                        trackEvent('multi_step_form', 'next_step', `Step ${currentStepNum + 1}`);
                    }
                }
            });
        });

        prevButtons.forEach(button => {
            button.addEventListener('click', function () {
                const currentStep = this.closest('.form-step');
                const currentStepNum = parseInt(currentStep.getAttribute('data-step'));
                const prevStep = multiStepForm.querySelector(`.form-step[data-step="${currentStepNum - 1}"]`);

                if (prevStep) {
                    // Hide current step
                    currentStep.style.display = 'none';

                    // Show previous step
                    prevStep.style.display = 'block';

                    // Track step regression
                    if (typeof trackEvent === 'function') {
                        trackEvent('multi_step_form', 'prev_step', `Step ${currentStepNum - 1}`);
                    }
                }
            });
        });

        // Form submission
        multiStepForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simulate form submission
            console.log('Multi-step form submitted');

            // Track form submission
            if (typeof trackEvent === 'function') {
                trackEvent('form', 'submit', 'multi_step_form');
            }

            // Show confirmation
            alert('Form submitted successfully! This is a test environment, so no actual data has been sent.');

            // Reset form and go back to first step
            this.reset();
            formSteps.forEach((step, index) => {
                step.style.display = index === 0 ? 'block' : 'none';
            });
        });
    }

    // Search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const searchTerm = document.getElementById('search-input').value;
            const filters = Array.from(this.querySelectorAll('input[name="filter"]:checked'))
                .map(filter => filter.value);

            // Simulate search
            console.log('Search submitted:', { searchTerm, filters });

            // Track search
            if (typeof trackEvent === 'function') {
                trackEvent('search', 'submit', searchTerm);

                if (filters.length > 0) {
                    trackEvent('search', 'filter', filters.join(','));
                }
            }

            // Show results (in a real app, this would fetch and display results)
            alert(`Search for "${searchTerm}" submitted! This is a test environment, so no actual search is performed.`);
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('login-email').value;

            // Simulate login
            console.log('Login attempted:', { email });

            // Track login attempt
            if (typeof trackEvent === 'function') {
                trackEvent('auth', 'login_attempt', 'form');
            }

            // Show confirmation
            alert('Login successful! This is a test environment, so no actual authentication has occurred.');

            // Reset form
            this.reset();
        });

        // Social login buttons
        const socialButtons = document.querySelectorAll('.social-button');
        socialButtons.forEach(button => {
            button.addEventListener('click', function () {
                const provider = this.getAttribute('data-provider');

                // Simulate social login
                console.log('Social login attempted:', { provider });

                // Track social login attempt
                if (typeof trackEvent === 'function') {
                    trackEvent('auth', 'login_attempt', provider);
                }

                // Show confirmation
                alert(`${provider} login initiated! This is a test environment, so no actual authentication has occurred.`);
            });
        });
    }

    // Subscription form
    const subscriptionForm = document.getElementById('subscription-form');
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const subscription = document.querySelector('input[name="subscription"]:checked').value;
            const annualBilling = document.getElementById('annual-billing').checked;

            // Simulate subscription
            console.log('Subscription selected:', { subscription, annualBilling });

            // Track subscription selection
            if (typeof trackEvent === 'function') {
                trackEvent('subscription', 'select_plan', subscription);

                if (annualBilling) {
                    trackEvent('subscription', 'billing_option', 'annual');
                } else {
                    trackEvent('subscription', 'billing_option', 'monthly');
                }
            }

            // Show confirmation
            alert(`You've selected the ${subscription} plan with ${annualBilling ? 'annual' : 'monthly'} billing. This is a test environment, so no actual subscription has been processed.`);
        });

        // Track subscription option changes
        const subscriptionOptions = document.querySelectorAll('input[name="subscription"]');
        subscriptionOptions.forEach(option => {
            option.addEventListener('change', function () {
                if (this.checked) {
                    const plan = this.value;

                    // Track plan selection
                    if (typeof trackEvent === 'function') {
                        trackEvent('subscription', 'change_plan', plan);
                    }
                }
            });
        });

        // Track billing option changes
        const annualBillingCheckbox = document.getElementById('annual-billing');
        if (annualBillingCheckbox) {
            annualBillingCheckbox.addEventListener('change', function () {
                const billingType = this.checked ? 'annual' : 'monthly';

                // Track billing type change
                if (typeof trackEvent === 'function') {
                    trackEvent('subscription', 'change_billing', billingType);
                }
            });
        }
    }

    // Modal functionality
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function (e) {
            e.preventDefault();

            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);

            if (modal) {
                modal.classList.add('active');

                // Track modal open
                if (typeof trackEvent === 'function') {
                    trackEvent('modal', 'open', modalId);
                }
            }
        });
    });

    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            modal.classList.remove('active');

            // Track modal close
            if (typeof trackEvent === 'function') {
                trackEvent('modal', 'close', modal.id);
            }
        });
    });

    // Close modal when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                this.classList.remove('active');

                // Track modal close
                if (typeof trackEvent === 'function') {
                    trackEvent('modal', 'close_outside', this.id);
                }
            }
        });
    });
});

// Generic tracking function
function trackEvent(category, action, label) {
    // Log the event to console (for debugging)
    console.log('Track Event:', { category, action, label });

    // Initialize dataLayer if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Check if analytics cookies are accepted
    const cookiePreferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{"essential":true,"analytics":true,"marketing":false}');

    // Always push to dataLayer regardless of cookie preferences
    // This ensures tracking works for testing purposes
    dataLayer.push({
        'event': 'custom_event',
        'event_category': category,
        'event_action': action,
        'event_label': label
    });

    // If analytics cookies are not accepted, don't send to analytics platforms
    if (!cookiePreferences.analytics) {
        console.log('Analytics tracking disabled by user preferences (but dataLayer push completed)');
        return;
    }

    // If using Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}
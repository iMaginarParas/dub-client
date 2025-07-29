// Alternative Mobile-Optimized Slider (no white placeholders)
(function() {
    'use strict';

    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function() {
        initializeSlider();
    });

    function initializeSlider() {
        const sliderTrack = document.getElementById('sliderTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dots = document.querySelectorAll('#sliderDots .dot');
        const sliderContainer = document.querySelector('.slider-container');

        if (!sliderTrack || !prevBtn || !nextBtn || !sliderContainer) {
            console.log('Slider elements not found');
            return;
        }

        // Get slide dimensions based on device
        function getSlideConfig() {
            const containerWidth = sliderContainer.offsetWidth;
            const isMobile = window.innerWidth <= 768;
            const isSmallMobile = window.innerWidth <= 480;
            
            let slideWidth, gap;
            
            if (isSmallMobile) {
                slideWidth = 160;
                gap = 10;
            } else if (isMobile) {
                slideWidth = 200;
                gap = 15;
            } else {
                slideWidth = 280;
                gap = 15;
            }
            
            const visibleSlides = Math.floor((containerWidth + gap) / (slideWidth + gap));
            
            return { slideWidth, gap, visibleSlides };
        }

        let { slideWidth, gap, visibleSlides } = getSlideConfig();
        let originalSlides = Array.from(sliderTrack.children);
        let totalSlides = originalSlides.length;
        let currentIndex = 0;
        let isTransitioning = false;
        let autoplay = null;

        // Simple infinite loop - duplicate slides only once
        function setupInfiniteLoop() {
            // Remove existing clones
            sliderTrack.querySelectorAll('.clone').forEach(clone => clone.remove());
            
            originalSlides = Array.from(sliderTrack.children);
            totalSlides = originalSlides.length;
            
            if (totalSlides === 0) return;

            // Create just one set of clones at the end
            originalSlides.forEach((slide, index) => {
                const clone = slide.cloneNode(true);
                clone.classList.add('clone');
                clone.setAttribute('data-clone-index', index);
                
                // Ensure images load properly
                const imgs = clone.querySelectorAll('img');
                imgs.forEach(img => {
                    if (img.src) {
                        img.onload = null; // Remove any existing handlers
                        img.style.opacity = '1';
                    }
                });
                
                sliderTrack.appendChild(clone);
            });

            // Update slide styles
            updateSlideStyles();
        }

        function updateSlideStyles() {
            const allSlides = sliderTrack.children;
            Array.from(allSlides).forEach(slide => {
                slide.style.flex = `0 0 ${slideWidth}px`;
                slide.style.width = `${slideWidth}px`;
                slide.style.marginRight = `${gap}px`;
            });
        }

        function updatePosition(animate = true) {
            const translateX = -(currentIndex * (slideWidth + gap));
            sliderTrack.style.transition = animate ? 'transform 0.4s ease-out' : 'none';
            sliderTrack.style.transform = `translateX(${translateX}px)`;
        }

        function updateDots() {
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === (currentIndex % totalSlides));
            });
        }

        function nextSlide() {
            if (isTransitioning || totalSlides === 0) return;
            
            isTransitioning = true;
            currentIndex++;
            
            updatePosition(true);
            updateDots();
            
            // Reset to beginning when we reach the clones
            if (currentIndex >= totalSlides) {
                setTimeout(() => {
                    currentIndex = 0;
                    updatePosition(false);
                    isTransitioning = false;
                }, 400);
            } else {
                setTimeout(() => isTransitioning = false, 400);
            }
        }

        function prevSlide() {
            if (isTransitioning || totalSlides === 0) return;
            
            isTransitioning = true;
            
            if (currentIndex <= 0) {
                // Jump to end of real slides
                currentIndex = totalSlides - 1;
                updatePosition(false);
                setTimeout(() => {
                    isTransitioning = false;
                }, 50);
            } else {
                currentIndex--;
                updatePosition(true);
                setTimeout(() => isTransitioning = false, 400);
            }
            
            updateDots();
        }

        function goToSlide(index) {
            if (isTransitioning) return;
            currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
            updatePosition(true);
            updateDots();
        }

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // Touch support
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        sliderContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        }, { passive: true });

        sliderContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const deltaX = Math.abs(currentX - startX);
            const deltaY = Math.abs(currentY - startY);
            
            if (deltaX > deltaY && deltaX > 10) {
                e.preventDefault();
            }
        }, { passive: false });

        sliderContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const deltaX = endX - startX;
            
            if (Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            }
            
            isDragging = false;
        }, { passive: true });

        // Autoplay
        function startAutoplay() {
            if (autoplay) clearInterval(autoplay);
            if (totalSlides > 1) {
                autoplay = setInterval(nextSlide, 4000);
            }
        }

        function stopAutoplay() {
            if (autoplay) {
                clearInterval(autoplay);
                autoplay = null;
            }
        }

        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);

        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoplay();
            } else {
                startAutoplay();
            }
        });

        // Resize handler
        function handleResize() {
            const newConfig = getSlideConfig();
            slideWidth = newConfig.slideWidth;
            gap = newConfig.gap;
            visibleSlides = newConfig.visibleSlides;
            
            updateSlideStyles();
            updatePosition(false);
        }

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        window.addEventListener('resize', debounce(handleResize, 250));

        // Initialize
        if (totalSlides > 0) {
            setupInfiniteLoop();
            updatePosition(false);
            startAutoplay();
        }

        // Global controls
        window.sliderControls = {
            next: nextSlide,
            prev: prevSlide,
            goTo: goToSlide,
            startAutoplay: startAutoplay,
            stopAutoplay: stopAutoplay
        };
    }

    // Mobile menu and other functionality (simplified)
    ready(function() {
        initializeMobileMenu();
    });

    function initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');

        if (!mobileMenuToggle || !navMenu) return;

        function toggleMobileMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            mobileMenuToggle.textContent = isActive ? '✕' : '☰';
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
        }

        // Multiple event types for better mobile support
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        mobileMenuToggle.addEventListener('touchstart', toggleMobileMenu, { passive: false });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileMenuToggle.textContent = '☰';
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

})();
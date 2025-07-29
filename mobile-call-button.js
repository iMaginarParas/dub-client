// Mobile Sticky Call Button Script
(function() {
    'use strict';
    
    // Create the mobile call button
    function createMobileCallButton() {
        // Check if button already exists
        if (document.querySelector('.mobile-call-sticky')) {
            return;
        }
        
        // Create the sticky container
        const stickyContainer = document.createElement('div');
        stickyContainer.className = 'mobile-call-sticky';
        
        // Create the call button
        const callButton = document.createElement('a');
        callButton.href = 'tel:+971588806498';
        callButton.className = 'mobile-call-btn';
        callButton.setAttribute('aria-label', 'Call +971588806498');
        
        // Add phone icon SVG
        const phoneIcon = document.createElement('div');
        phoneIcon.className = 'call-icon';
        phoneIcon.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
        `;
        
        // Add call text
        const callText = document.createElement('div');
        callText.className = 'call-text';
        callText.textContent = 'Call Now';
        
        // Add phone number
        const phoneNumber = document.createElement('div');
        phoneNumber.className = 'call-number';
        phoneNumber.textContent = '+971588806498';
        
        // Assemble the button
        callButton.appendChild(phoneIcon);
        const textContainer = document.createElement('div');
        textContainer.appendChild(callText);
        textContainer.appendChild(phoneNumber);
        callButton.appendChild(textContainer);
        
        stickyContainer.appendChild(callButton);
        
        // Add to page
        document.body.appendChild(stickyContainer);
        
        // Add click tracking (optional)
        callButton.addEventListener('click', function() {
            // You can add analytics tracking here if needed
            console.log('Mobile call button clicked');
        });
    }
    
    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createMobileCallButton);
        } else {
            createMobileCallButton();
        }
    }
    
    // Auto-hide on scroll down, show on scroll up (optional enhancement)
    function initScrollBehavior() {
        let lastScrollTop = 0;
        let isScrolling = false;
        
        window.addEventListener('scroll', function() {
            if (!isScrolling) {
                window.requestAnimationFrame(function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const callButton = document.querySelector('.mobile-call-sticky');
                    
                    if (callButton) {
                        if (scrollTop > lastScrollTop && scrollTop > 100) {
                            // Scrolling down
                            callButton.style.transform = 'translateY(100px)';
                            callButton.style.opacity = '0.7';
                        } else {
                            // Scrolling up
                            callButton.style.transform = 'translateY(0)';
                            callButton.style.opacity = '1';
                        }
                    }
                    
                    lastScrollTop = scrollTop;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }
    
    // Add transition styles for scroll behavior
    function addTransitionStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .mobile-call-sticky {
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize everything
    init();
    
    // Optional: Enable scroll behavior (uncomment if you want auto-hide/show on scroll)
    // addTransitionStyles();
    // initScrollBehavior();
    
})();
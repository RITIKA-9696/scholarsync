// ========== HEADER AND FOOTER LOADER WITH ACTIVE STATE ==========

// Load header and footer when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
});

function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) return;

    fetch('/components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Header not found');
            }
            return response.text();
        })
        .then(data => {
            headerPlaceholder.innerHTML = data;
            
            // Initialize header functionality after it's loaded
            initializeHeader();
            
            // Set active page based on current URL
            setTimeout(() => {
                setActivePage();
            }, 100); // Small delay to ensure DOM is ready
        })
        .catch(error => {
            console.error('Error loading header:', error);
            headerPlaceholder.innerHTML = getFallbackHeader();
            initializeHeader();
            setActivePage();
        });
}

function loadFooter() {
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (!footerPlaceholder) return;

    fetch('/components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Footer not found');
            }
            return response.text();
        })
        .then(data => {
            footerPlaceholder.innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
            footerPlaceholder.innerHTML = getFallbackFooter();
        });
}

function initializeHeader() {
    // Theme Toggle
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    window.toggleTheme = function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    // Desktop Dropdown Toggle
    window.toggleDropdown = function(dropdownId, event) {
        if (event) {
            event.stopPropagation();
        }
        
        // Get all dropdown menus
        const allDropdowns = document.querySelectorAll('.dropdown-menu');
        const currentDropdown = document.getElementById(dropdownId);
        
        // Find the button that was clicked
        const buttons = document.querySelectorAll('.dropdown-btn');
        let currentButton = null;
        let currentIcon = null;
        
        buttons.forEach(btn => {
            if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(dropdownId)) {
                currentButton = btn;
                currentIcon = btn.querySelector('.dropdown-icon');
            }
        });
        
        // Close all other dropdowns
        allDropdowns.forEach(dropdown => {
            if (dropdown.id !== dropdownId && !dropdown.classList.contains('hidden')) {
                dropdown.classList.add('hidden');
                // Reset icon rotation for other dropdowns
                const otherButton = document.querySelector(`[onclick*="${dropdown.id}"]`);
                if (otherButton) {
                    const otherIcon = otherButton.querySelector('.dropdown-icon');
                    if (otherIcon) otherIcon.classList.remove('rotate');
                }
            }
        });
        
        // Toggle current dropdown
        if (currentDropdown) {
            currentDropdown.classList.toggle('hidden');
            
            // Rotate icon
            if (currentIcon) {
                currentIcon.classList.toggle('rotate');
            }
        }
    };

    // Mobile Dropdown Toggle
    window.toggleMobileDropdown = function(dropdownId, button) {
        const dropdown = document.getElementById(dropdownId);
        const icon = button.querySelector('.mobile-dropdown-icon');
        
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            
            // Rotate icon
            if (icon) {
                icon.classList.toggle('rotate');
            }
        }
    };

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                if (!menu.classList.contains('hidden')) {
                    menu.classList.add('hidden');
                    
                    // Reset icon rotation
                    const buttons = document.querySelectorAll('.dropdown-btn');
                    buttons.forEach(btn => {
                        const icon = btn.querySelector('.dropdown-icon');
                        if (icon) icon.classList.remove('rotate');
                    });
                }
            });
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        // Remove any existing event listeners by cloning
        const newMobileMenuBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newMobileMenuBtn, mobileMenuBtn);
        
        newMobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

function setActivePage() {
    // Get current page path
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    console.log('Setting active page for:', filename); // Debug log
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.classList.remove('active', 'text-indigo-600', 'dark:text-indigo-400');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
        
        // Remove any inline styles
        link.style.removeProperty('color');
    });
    
    // Add active class to current page link
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        const href = link.getAttribute('href');
        
        // Check if this link matches the current page
        if (href === filename || 
            (filename === '' && href === '/') || 
            (filename === 'index.html' && href === '/') ||
            currentPath.endsWith(href)) {
            
            console.log('Active link found:', href); // Debug log
            
            link.classList.add('active', 'text-indigo-600', 'dark:text-indigo-400');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
            
            // For dropdown parent buttons, we don't change their color
            if (link.classList.contains('dropdown-btn')) {
                // Handle dropdown parent if needed
            }
        }
    });
    
    // Also check for dropdown items
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === filename || 
            (filename === '' && href === '/') || 
            (filename === 'index.html' && href === '/') ||
            currentPath.endsWith(href)) {
            
            link.classList.add('text-indigo-600', 'dark:text-indigo-400', 'font-medium');
        }
    });
}

function getFallbackHeader() {
    return `
        <header>
            <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-14">
                        <a href="/" class="text-xl font-bold text-indigo-600 dark:text-indigo-400">ScholarSync</a>
                        <div class="hidden md:flex items-center space-x-5">
                            <a href="/" class="nav-link text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600">Home</a>
                            <a href="/about.html" class="nav-link text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600">About</a>
                            <a href="/blog.html" class="nav-link text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600">Blogs</a>
                            <button onclick="toggleTheme()" class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <i class="fas fa-sun dark:hidden"></i>
                                <i class="fas fa-moon hidden dark:inline"></i>
                            </button>
                        </div>
                        <button id="mobileMenuBtn" class="md:hidden">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    `;
}

function getFallbackFooter() {
    return `
        <footer class="bg-gray-900 text-white py-8">
            <div class="max-w-7xl mx-auto px-4 text-center">
                <p>&copy; 2024 ScholarSync. All rights reserved.</p>
            </div>
        </footer>
    `;
}

// Also run when URL changes (for single page apps)
window.addEventListener('popstate', function() {
    setTimeout(setActivePage, 100);
});

// Toast notification utility
window.showToast = function(message, type = 'success') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
    
    const toast = document.createElement('div');
    toast.className = `px-4 py-2 rounded-lg text-sm shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-600 text-white' :
        type === 'error' ? 'bg-red-600 text-white' :
        'bg-gray-800 text-white'
    }`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    }, 3000);
};
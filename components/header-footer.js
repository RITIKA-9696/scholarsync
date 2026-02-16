// ========== HEADER AND FOOTER LOADER ==========

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
            
            // Set active page
            setActivePage();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            // Fallback header if file not found
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
            // Fallback footer if file not found
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
    const currentPath = window.location.pathname;
    const filename = currentPath.split('/').pop() || 'index.html';
    
    // Remove active class from all
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.classList.remove('active', 'text-indigo-600', 'dark:text-indigo-400');
        link.classList.add('text-gray-700', 'dark:text-gray-300');
    });
    
    // Add active class to current page link
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        const href = link.getAttribute('href');
        if (href === filename || (filename === '' && href === '/')) {
            link.classList.add('active', 'text-indigo-600', 'dark:text-indigo-400');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
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
                            <a href="/" class="text-sm text-gray-700 dark:text-gray-300">Home</a>
                            <a href="/about.html" class="text-sm text-gray-700 dark:text-gray-300">About</a>
                            <a href="/blog.html" class="text-sm text-gray-700 dark:text-gray-300">Blogs</a>
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
    toast.className = `px-4 py-2 rounded-lg text-sm shadow-lg ${
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
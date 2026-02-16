// ========== COMMON JAVASCRIPT FOR HEADER & FOOTER ==========

// Theme Toggle Function
(function() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme on load
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // Make toggle function global
    window.toggleTheme = function() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
})();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
});

// Mobile Dropdown Toggle
window.toggleMobileDropdown = function(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
};

// Set Active Page in Navigation
document.addEventListener('DOMContentLoaded', function() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Define page mapping
    const pageMap = {
        '/': 'home',
        '/index.html': 'home',
        '/blog.html': 'blog',
        '/workshops.html': 'workshops',
        '/study-material.html': 'study',
        '/one-to-one.html': 'one-to-one',
        '/about.html': 'about',
        '/contact.html': 'contact',
        '/services/consulting.html': 'services',
        '/services/coaching.html': 'services',
        '/services/mentoring.html': 'services',
        '/products/dicedb.html': 'products',
        '/products/system-design-handbook.html': 'products',
        '/products/video-courses.html': 'products',
        '/products/cheat-sheets.html': 'products',
        '/products/interview-kit.html': 'products'
    };
    
    const currentPage = pageMap[currentPath] || '';
    
    // Highlight desktop nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('text-indigo-600', 'dark:text-indigo-400');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
        }
    });
    
    // Highlight mobile nav links
    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) {
            link.classList.add('text-indigo-600');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
        }
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none';
        });
    }
});

// Show dropdown on hover (desktop)
document.querySelectorAll('.dropdown').forEach(dropdown => {
    dropdown.addEventListener('mouseenter', function() {
        const menu = this.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'block';
        }
    });
    
    dropdown.addEventListener('mouseleave', function() {
        const menu = this.querySelector('.dropdown-menu');
        if (menu) {
            menu.style.display = 'none';
        }
    });
});

// Toast notification utility
window.showToast = function(message, type = 'success') {
    // Check if toast container exists, if not create it
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'fixed bottom-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `px-4 py-2 rounded-lg text-sm shadow-lg transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-600 text-white' :
        type === 'error' ? 'bg-red-600 text-white' :
        'bg-gray-800 text-white'
    }`;
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.remove();
        if (toastContainer.children.length === 0) {
            toastContainer.remove();
        }
    }, 3000);
};

// Copy to clipboard utility
window.copyToClipboard = function(text, message = 'Copied to clipboard!') {
    navigator.clipboard.writeText(text).then(() => {
        showToast(message, 'success');
    }).catch(() => {
        showToast('Failed to copy', 'error');
    });
};

// Format date utility
window.formatDate = function(date, format = 'DD MMM YYYY') {
    const d = new Date(date);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (format === 'DD MMM YYYY') {
        return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    }
    return d.toLocaleDateString();
};

// Load header and footer dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('/components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Re-initialize event listeners after header loads
            initializeNavEvents();
        })
        .catch(error => console.error('Error loading header:', error));
    
    // Load footer
    fetch('/components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Initialize navigation events after header loads
function initializeNavEvents() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}
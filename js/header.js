// ===== HEADER JAVASCRIPT - FRITZ HIGIENIZAÇÃO =====

// Inicialização do header quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initHeader();
});

// Função principal de inicialização do header
function initHeader() {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    
    console.log('Header Fritz Higienização inicializado com sucesso!');
}

// ===== HEADER SCROLL =====
function initHeaderScroll() {
    const header = document.querySelector('.header-top');
    
    if (!header) return;
    
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100));
}

// ===== MENU MOBILE =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileClose = document.querySelector('.mobile-menu-close');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-menu a');
    
    if (!mobileToggle || !mobileMenu) return;
    
    // Abrir menu
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // Fechar menu
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (mobileClose) {
        mobileClose.addEventListener('click', closeMobileMenu);
    }
    
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Fechar menu ao clicar em links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
    
    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header-top').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== UTILITÁRIOS =====

// Throttle function para performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}


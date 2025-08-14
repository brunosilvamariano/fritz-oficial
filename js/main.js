// ===== JAVASCRIPT PRINCIPAL - FRITZ HIGIENIZAÇÃO =====

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Função principal de inicialização
function initializeApp() {
    initAOS();
    initScrollEffects();
    initFloatingButtons();
    initCalculadora();
    initSmoothScroll();
    initHeaderScroll();
    initMobileMenu();
    initCarousel();
    initAccordion();
    initTooltips();
    initLazyLoading();
    
    console.log('Fritz Higienização - Landing Page inicializada com sucesso!');
}

// ===== INICIALIZAÇÃO DO AOS (Animate On Scroll) =====
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0
        });
    }
}

// ===== EFEITOS DE SCROLL =====
function initScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax suave nos elementos
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        // Fade in/out baseado no scroll
        const fadeElements = document.querySelectorAll('[data-fade]');
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('fade-in');
            }
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// ===== BOTÕES FLUTUANTES =====
function initFloatingButtons() {
    const btnTop = document.getElementById('btnTop');
    const btnWhatsapp = document.querySelector('.btn-whatsapp');
    
    // Botão voltar ao topo
    if (btnTop) {
        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                btnTop.classList.add('show');
            } else {
                btnTop.classList.remove('show');
            }
        }, 100));
        
        // Scroll suave para o topo
        btnTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Animação do botão WhatsApp
    if (btnWhatsapp) {
        // Efeito de hover melhorado
        btnWhatsapp.addEventListener('mouseenter', () => {
            btnWhatsapp.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        btnWhatsapp.addEventListener('mouseleave', () => {
            btnWhatsapp.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Tracking de clique
        btnWhatsapp.addEventListener('click', () => {
            trackEvent('whatsapp_click', 'floating_button');
        });
    }
}

// ===== CALCULADORA DE ORÇAMENTO =====
function initCalculadora() {
    const form = document.getElementById('calculadoraForm');
    const resultado = document.getElementById('resultadoOrcamento');
    const valorEstimado = document.getElementById('valorEstimado');
    
    if (!form) return;
    
    // Preços base dos serviços
    const precos = {
        sofa: 80,
        cadeira: 40,
        colchao: 100,
        poltrona: 60
    };
    
    // Multiplicadores
    const multiplicadores = {
        tamanho: {
            pequeno: 1,
            medio: 1.3,
            grande: 1.6
        },
        condicao: {
            normal: 1,
            manchado: 1.2,
            'muito-sujo': 1.5
        }
    };
    
    // Atualizar cálculo em tempo real
    const campos = form.querySelectorAll('select, input');
    campos.forEach(campo => {
        campo.addEventListener('change', calcularOrcamentoAutomatico);
    });
}

function calcularOrcamento() {
    const tipoServicoSelect = document.getElementById('tipoServico');
    const quantidadeInput = document.getElementById('quantidade');
    const tamanhoSelect = document.getElementById('tamanho');
    const condicaoSelect = document.getElementById('condicao');
    const resultadoDiv = document.getElementById('resultadoOrcamento');
    const valorEstimadoSpan = document.getElementById('valorEstimado');
    const whatsappButton = resultadoDiv.querySelector('.btn-success');

    // Validação
    if (!tipoServicoSelect.value || !quantidadeInput.value || !tamanhoSelect.value || !condicaoSelect.value) {
        showToast('Por favor, preencha todos os campos', 'warning');
        return;
    }
    
    // Cálculo
    const precoBase = parseInt(tipoServicoSelect.selectedOptions[0].dataset.preco);
    const qtd = parseInt(quantidadeInput.value);
    const multTamanho = parseFloat(tamanhoSelect.selectedOptions[0].dataset.multiplicador);
    const multCondicao = parseFloat(condicaoSelect.selectedOptions[0].dataset.multiplicador);
    
    const valorFinal = precoBase * qtd * multTamanho * multCondicao;
    
    // Exibir resultado
    valorEstimadoSpan.textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
    resultadoDiv.style.display = 'block';
    
    // Animação suave
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Gerar mensagem para WhatsApp
    const tipoServicoTexto = tipoServicoSelect.selectedOptions[0].textContent.split('(')[0].trim();
    const tamanhoTexto = tamanhoSelect.selectedOptions[0].textContent.trim();
    const condicaoTexto = condicaoSelect.selectedOptions[0].textContent.trim();

    const mensagemWhatsApp = `Olá! Gostaria de solicitar um orçamento para higienização de estofados com as seguintes informações:\n- Tipo de Serviço: ${tipoServicoTexto}\n- Quantidade: ${qtd}\n- Tamanho: ${tamanhoTexto}\n- Condição: ${condicaoTexto}\n- Valor Estimado: R$ ${valorFinal.toFixed(2).replace('.', ',')}\n\nPor favor, confirme a disponibilidade e o valor final.`;
    
    const whatsappLink = `https://wa.me/554799051278?text=${encodeURIComponent(mensagemWhatsApp)}`;
    whatsappButton.href = whatsappLink;

    // Tracking
    trackEvent('orcamento_calculado', 'calculadora', valorFinal);
    
    // Toast de sucesso
    showToast('Orçamento calculado com sucesso!', 'success');
}

function calcularOrcamentoAutomatico() {
    const tipoServico = document.getElementById('tipoServico');
    const quantidade = document.getElementById('quantidade');
    const tamanho = document.getElementById('tamanho');
    const condicao = document.getElementById('condicao');
    
    if (tipoServico.value && quantidade.value && tamanho.value && condicao.value) {
        calcularOrcamento();
    }
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
                
                // Tracking
                trackEvent('internal_link_click', 'navigation', targetId);
            }
        });
    });
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
        
        // Tracking
        trackEvent('mobile_menu_open', 'navigation');
    });
    
    // Fechar menu
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Tracking
        trackEvent('mobile_menu_close', 'navigation');
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
            
            // Tracking
            const targetId = link.getAttribute('href');
            trackEvent('mobile_menu_link_click', 'navigation', targetId);
        });
    });
    
    // Fechar menu com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ===== CAROUSEL MELHORADO =====
function initCarousel() {
    const carousel = document.getElementById('antesDepoisCarousel');
    
    if (!carousel) return;
    
    // Auto-play
    const autoPlayInterval = 5000;
    let autoPlay = setInterval(() => {
        const nextButton = carousel.querySelector('.carousel-control-next');
        if (nextButton) nextButton.click();
    }, autoPlayInterval);
    
    // Pausar auto-play no hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlay);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            const nextButton = carousel.querySelector('.carousel-control-next');
            if (nextButton) nextButton.click();
        }, autoPlayInterval);
    });
    
    // Tracking de slides
    carousel.addEventListener('slide.bs.carousel', (e) => {
        trackEvent('carousel_slide', 'antes_depois', e.to);
    });
}

// ===== ACCORDION MELHORADO =====
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        
        if (button) {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-bs-target');
                trackEvent('faq_click', 'accordion', targetId);
            });
        }
    });
}

// ===== TOOLTIPS =====
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.classList.add('tooltip-custom');
    });
}

// ===== LAZY LOADING =====
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
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

// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Sistema de Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = getOrCreateToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast-custom ${type}`;
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${getToastIcon(type)} me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remover toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getOrCreateToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function getToastIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'x-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

// Sistema de Tracking de Eventos
function trackEvent(action, category, label = '', value = 0) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CustomEvent', {
            action: action,
            category: category,
            label: label
        });
    }
    
    // Console log para desenvolvimento
    console.log('Event tracked:', { action, category, label, value });
}

// Validação de formulários
function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Formatação de moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Detecção de dispositivo móvel
function isMobile() {
    return window.innerWidth <= 768;
}

// Scroll to element with offset
function scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
    });
}

// ===== EVENTOS GLOBAIS =====

// Redimensionamento da janela
window.addEventListener('resize', debounce(() => {
    // Recalcular AOS se necessário
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
    
    // Ajustar elementos responsivos
    adjustResponsiveElements();
}, 250));

function adjustResponsiveElements() {
    const isMobileView = isMobile();
    
    // Ajustar carousel para mobile
    const carousel = document.getElementById('antesDepoisCarousel');
    if (carousel) {
        const indicators = carousel.querySelectorAll('.carousel-indicators button');
        indicators.forEach(indicator => {
            if (isMobileView) {
                indicator.style.width = '8px';
                indicator.style.height = '8px';
            } else {
                indicator.style.width = '12px';
                indicator.style.height = '12px';
            }
        });
    }
}

// Prevenção de spam em formulários
let formSubmissionTimeout = false;

function preventSpamSubmission(callback, delay = 2000) {
    if (formSubmissionTimeout) {
        showToast('Aguarde um momento antes de enviar novamente', 'warning');
        return false;
    }
    
    formSubmissionTimeout = true;
    setTimeout(() => {
        formSubmissionTimeout = false;
    }, delay);
    
    return callback();
}

// ===== PERFORMANCE MONITORING =====
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                
                // Track performance
                trackEvent('page_load_time', 'performance', 'load_time', loadTime);
            }, 0);
        });
    }
}

// Inicializar monitoramento de performance
measurePerformance();

// ===== ACESSIBILIDADE =====
function initAccessibility() {
    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        // ESC para fechar modais
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal.show');
            modals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
        
        // Enter para ativar botões
        if (e.key === 'Enter' && e.target.classList.contains('btn')) {
            e.target.click();
        }
    });
}

// Inicializar acessibilidade
initAccessibility();




// ===== FUNCIONALIDADE DE COMPARAÇÃO ANTES E DEPOIS =====
function initBeforeAfterSliders() {
    const comparisonCards = document.querySelectorAll('.comparison-card');
    
    comparisonCards.forEach(card => {
        const slider = card.querySelector('.comparison-slider');
        const container = card.querySelector('.comparison-container');
        const imageAntes = card.querySelector('.image-antes');
        const imageDepois = card.querySelector('.image-depois');
        
        if (!slider || !container || !imageAntes || !imageDepois) return;
        
        let isDragging = false;
        let startX = 0;
        let currentX = 50; // Posição inicial em porcentagem
        
        // Função para atualizar a posição do slider
        function updateSliderPosition(percentage) {
            // Limitar entre 10% e 90%
            percentage = Math.max(10, Math.min(90, percentage));
            currentX = percentage;
            
            // Atualizar posição do slider
            slider.style.left = `${percentage}%`;
            
            // Atualizar clip-path das imagens
            imageAntes.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
            imageDepois.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        }
        
        // Função para obter a posição X relativa ao container
        function getRelativeX(clientX) {
            const rect = container.getBoundingClientRect();
            return ((clientX - rect.left) / rect.width) * 100;
        }
        
        // Eventos de mouse
        slider.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            slider.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const percentage = getRelativeX(e.clientX);
            updateSliderPosition(percentage);
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                slider.style.cursor = 'col-resize';
                document.body.style.userSelect = '';
            }
        });
        
        // Eventos de touch para dispositivos móveis
        slider.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            e.preventDefault();
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const percentage = getRelativeX(e.touches[0].clientX);
            updateSliderPosition(percentage);
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
            }
        });
        
        // Clique direto no container para mover o slider
        container.addEventListener('click', (e) => {
            if (e.target === slider || slider.contains(e.target)) return;
            
            const percentage = getRelativeX(e.clientX);
            updateSliderPosition(percentage);
            
            // Animação suave
            slider.style.transition = 'left 0.3s ease';
            imageAntes.style.transition = 'clip-path 0.3s ease';
            imageDepois.style.transition = 'clip-path 0.3s ease';
            
            setTimeout(() => {
                slider.style.transition = '';
                imageAntes.style.transition = '';
                imageDepois.style.transition = '';
            }, 300);
        });
        
        // Inicializar posição
        updateSliderPosition(50);
        
        // Efeito de hover melhorado
        slider.addEventListener('mouseenter', () => {
            if (!isDragging) {
                slider.style.transform = 'translateX(-50%) scale(1.1)';
            }
        });
        
        slider.addEventListener('mouseleave', () => {
            if (!isDragging) {
                slider.style.transform = 'translateX(-50%) scale(1)';
            }
        });
    });
}

// Atualizar a função de inicialização principal
function initializeApp() {
    initAOS();
    initScrollEffects();
    initFloatingButtons();
    initCalculadora();
    initSmoothScroll();
    initHeaderScroll();
    initCarousel();
    initAccordion();
    initTooltips();
    initLazyLoading();
    initBeforeAfterSliders(); // Adicionar esta linha
    
    console.log('Fritz Higienização - Landing Page inicializada com sucesso!');
}


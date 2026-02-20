/**
 * Infallible Before/After Slider
 * Corrigido para garantir o efeito de revelação (clip-path)
 */
document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('.ba-container');

    containers.forEach(container => {
        const slider = container.querySelector('.ba-slider');
        const afterImg = container.querySelector('.ba-after');
        let isDragging = false;

        // Função para atualizar a posição (0 a 100)
        function updatePosition(x) {
            const rect = container.getBoundingClientRect();
            let position = ((x - rect.left) / rect.width) * 100;

            // Limites de segurança
            if (position < 0) position = 0;
            if (position > 100) position = 100;

            // APLICAR O EFEITO
            // O slider move para a posição X
            slider.style.left = position + '%';
            // A imagem de DEPOIS (que está por cima) é cortada da esquerda até a posição X
            // Assim, o que está à DIREITA do slider é a imagem de DEPOIS
            // E o que está à ESQUERDA do slider é a imagem de ANTES (que está no fundo)
            afterImg.style.clipPath = `inset(0 0 0 ${position}%)`;
        }

        // Eventos de Mouse
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            updatePosition(e.clientX);
        });

        window.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            updatePosition(e.clientX);
        });

        window.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // Eventos de Toque (Mobile)
        container.addEventListener('touchstart', function(e) {
            isDragging = true;
            updatePosition(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            updatePosition(e.touches[0].clientX);
        }, { passive: false });

        window.addEventListener('touchend', function() {
            isDragging = false;
        });

        // Prevenir arrasto padrão de imagem
        container.addEventListener('dragstart', (e) => e.preventDefault());
    });
});

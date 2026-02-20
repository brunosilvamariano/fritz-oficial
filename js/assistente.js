/**
 * ASSISTENTE VIRTUAL GUIADO - HIGIENIZAÇÃO DE ESTOFADOS
 * Fluxo 100% baseado em opções com qualificação de lead
 */

document.addEventListener('DOMContentLoaded', () => {
    const floatingBtn = document.getElementById('bot-floating-button');
    const chatContainer = document.getElementById('bot-chat-container');
    const closeBtn = document.querySelector('.bot-close');
    const messageArea = document.getElementById('bot-messages-list');
    const typingIndicator = document.getElementById('typing-indicator');

    const WHATSAPP_NUMBER = "554799051278";
    
    let userContext = {
        service: null,
        detail: null
    };

    // Fluxo do Chat
    const flow = {
        start: {
            text: "Olá! Seja bem-vindo à nossa empresa de Higienização de Estofados. 👋<br><br>Sou seu assistente virtual e vou te ajudar a solicitar um orçamento rápido. O que você deseja higienizar?",
            options: [
                { text: "🛋️ Sofá", next: "sofa" },
                { text: "🛏️ Colchão", next: "colchao" },
                { text: "🪑 Cadeiras / Poltronas", next: "cadeiras" },
                { text: "🧼 Tapetes / Carpetes", next: "tapetes" }
            ]
        },

        sofa: {
            text: "Perfeito! Quantos lugares tem o sofá?",
            options: [
                { text: "2 lugares", next: "final", context: { service: "Higienização de Sofá", detail: "2 lugares" } },
                { text: "3 lugares", next: "final", context: { service: "Higienização de Sofá", detail: "3 lugares" } },
                { text: "Em L / Retrátil", next: "final", context: { service: "Higienização de Sofá", detail: "Sofá grande / em L" } }
            ]
        },

        colchao: {
            text: "Qual o tamanho do colchão?",
            options: [
                { text: "Solteiro", next: "final", context: { service: "Higienização de Colchão", detail: "Solteiro" } },
                { text: "Casal", next: "final", context: { service: "Higienização de Colchão", detail: "Casal" } },
                { text: "Queen / King", next: "final", context: { service: "Higienização de Colchão", detail: "Queen / King" } }
            ]
        },

        cadeiras: {
            text: "Quantas cadeiras ou poltronas aproximadamente?",
            options: [
                { text: "Até 4 unidades", next: "final", context: { service: "Higienização de Cadeiras", detail: "Até 4" } },
                { text: "5 a 8 unidades", next: "final", context: { service: "Higienização de Cadeiras", detail: "5 a 8" } },
                { text: "Mais de 8", next: "final", context: { service: "Higienização de Cadeiras", detail: "Mais de 8" } }
            ]
        },

        tapetes: {
            text: "Qual o tipo de tapete ou carpete?",
            options: [
                { text: "Tapete pequeno", next: "final", context: { service: "Higienização de Tapete", detail: "Pequeno" } },
                { text: "Tapete grande", next: "final", context: { service: "Higienização de Tapete", detail: "Grande" } },
                { text: "Carpete residencial/comercial", next: "final", context: { service: "Higienização de Carpete", detail: "Carpete" } }
            ]
        }
    };

    // Abrir / Fechar
    floatingBtn.addEventListener('click', () => {
        chatContainer.classList.toggle('active');
        if (chatContainer.classList.contains('active') && messageArea.children.length === 0) {
            renderStep("start");
        }
    });

    closeBtn.addEventListener('click', () => chatContainer.classList.remove('active'));

    function renderStep(stepKey) {
        const step = flow[stepKey];
        showBotMessage(step.text, step.options);
    }

    function showBotMessage(text, options = []) {
        typingIndicator.style.display = 'block';
        messageArea.scrollTop = messageArea.scrollHeight;

        setTimeout(() => {
            typingIndicator.style.display = 'none';
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message bot';
            msgDiv.innerHTML = `<div>${text}</div>`;
            
            if (options.length > 0) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'bot-actions';
                options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'action-btn';
                    btn.textContent = opt.text;
                    btn.onclick = () => handleSelection(opt);
                    actionsDiv.appendChild(btn);
                });
                msgDiv.appendChild(actionsDiv);
            }
            
            messageArea.appendChild(msgDiv);
            messageArea.scrollTop = messageArea.scrollHeight;
        }, 700);
    }

    function showUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user';
        msgDiv.textContent = text;
        messageArea.appendChild(msgDiv);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    function handleSelection(option) {
        showUserMessage(option.text);
        
        if (option.context) {
            userContext = { ...userContext, ...option.context };
        }

        if (option.next === "final") {
            showBotMessage("Perfeito! Já entendi o que você precisa. Agora vou te conectar com nosso especialista para passar o valor certinho e disponibilidade.");
            setTimeout(() => {
                const finishBtn = { text: "🚀 Atendimento imediato no WhatsApp", action: "send" };
                showBotMessage("Clique no botão abaixo para enviar sua solicitação:", [finishBtn]);
            }, 1000);
        } else if (option.action === "send") {
            finishAndSend();
        } else if (option.action === "restart") {
            messageArea.innerHTML = '';
            renderStep("start");
        } else if (option.action === "close") {
            showBotMessage("Agradecemos seu contato! Em breve nossa equipe vai te atender. ✨");
            setTimeout(() => {
                chatContainer.classList.remove('active');
            }, 3000);
        } else {
            renderStep(option.next);
        }
    }

    function finishAndSend() {
        const message = `Olá! Vim pelo site e gostaria de um orçamento para higienização.

📌 *Resumo do Pedido:*
🧼 *Serviço:* ${userContext.service}
📋 *Detalhe:* ${userContext.detail}

Aguardo retorno para valores e agendamento.`;

        const encodedMsg = encodeURIComponent(message);
        const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
        
        window.open(link, '_blank');

        setTimeout(() => {
            showBotMessage("Sua mensagem foi enviada! Deseja mais algum serviço?", [
                { text: "➕ Fazer outro orçamento", action: "restart" },
                { text: "👋 Encerrar atendimento", action: "close" }
            ]);
        }, 1500);
    }
});

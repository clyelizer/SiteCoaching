class Chat {
    constructor() {
        this.messages = [];
        this.isOpen = false;
        this.initializeUI();
        this.initializeSocket();
    }

    initializeSocket() {
        this.socket = new WebSocket('ws://localhost:3001');
        this.socket.onmessage = async (event) => {
            let data = event.data;
            if (data instanceof Blob) {
                data = await data.text();
            }
            try {
                const message = JSON.parse(data);
                this.addMessage(message);
            } catch (e) {
                this.addMessage({
                    text: "Erreur de réception du message.",
                    timestamp: new Date(),
                    sender: 'bot'
                });
            }
        };
        this.socket.onerror = () => {
            this.addMessage({
                text: "Connexion au chat impossible. Vérifiez que le serveur Node.js est bien lancé.",
                timestamp: new Date(),
                sender: 'bot'
            });
        };
        this.socket.onclose = () => {
            this.addMessage({
                text: "Connexion au chat perdue.",
                timestamp: new Date(),
                sender: 'bot'
            });
        };
    }

    initializeUI() {
        // Création du conteneur de chat
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'chat-container';
        this.chatContainer.innerHTML = `
            <div class="chat-header">
                <span>Chat en direct</span>
                <button class="chat-minimize">_</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="Votre message...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        `;

        document.body.appendChild(this.chatContainer);
        this.bindEvents();
    }

    bindEvents() {
        const input = this.chatContainer.querySelector('input');
        const button = this.chatContainer.querySelector('.chat-input button');
        const minimizeBtn = this.chatContainer.querySelector('.chat-minimize');

        button.addEventListener('click', () => this.sendMessage(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage(input.value);
        });
        minimizeBtn.addEventListener('click', () => this.toggleChat());
    }

    sendMessage(text) {
        if (!text.trim()) return;
        const message = {
            text,
            timestamp: new Date(),
            sender: 'user'
        };
        this.socket.send(JSON.stringify(message));
        this.chatContainer.querySelector('input').value = ''; // Clear input field
        this.scrollToLatestMessage(); // Ensure chat scrolls to the latest message
    }

    scrollToLatestMessage() {
        const messagesContainer = this.chatContainer.querySelector('.chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    addMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message ${message.sender}`;
        messageEl.innerHTML = `
            <div class="message-content">${message.text}</div>
            <div class="message-time">${new Date(message.timestamp).toLocaleTimeString()}</div>
        `;

        this.chatContainer.querySelector('.chat-messages').appendChild(messageEl);
        messageEl.scrollIntoView({ behavior: 'smooth' });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatContainer.classList.toggle('minimized');
    }
}

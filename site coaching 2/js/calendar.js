class Calendar {
    constructor(container) {
        this.container = container;
        this.currentDate = new Date();
        this.selectedDate = null;
        this.events = new Map();
        this.initializeCalendar();
    }

    initializeCalendar() {
        this.container.innerHTML = `
            <div class="calendar-header">
                <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
                <h2></h2>
                <button class="next-month"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="calendar-grid">
                <div class="weekdays"></div>
                <div class="days"></div>
            </div>
            <div class="calendar-events">
                <h3>Événements du jour</h3>
                <div class="events-list"></div>
                <button class="add-event">Ajouter un rendez-vous</button>
            </div>
        `;

        this.bindEvents();
        this.render();
    }

    bindEvents() {
        this.container.querySelector('.prev-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        this.container.querySelector('.next-month').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });

        this.container.querySelector('.add-event').addEventListener('click', () => {
            this.showAddEventModal();
        });
    }

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Mise à jour du titre
        this.container.querySelector('h2').textContent = 
            new Date(year, month).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

        // Rendu des jours de la semaine
        const weekdays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
        this.container.querySelector('.weekdays').innerHTML = 
            weekdays.map(day => `<div class="weekday">${day}</div>`).join('');

        // Rendu des jours du mois
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay() || 7; // Ajustement pour commencer par Lundi

        const daysHTML = Array(startingDay - 1).fill('<div class="day empty"></div>');
        
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const dateStr = date.toISOString().split('T')[0];
            const hasEvents = this.events.has(dateStr);
            const isSelected = this.selectedDate === dateStr;
            
            daysHTML.push(`
                <div class="day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''}" 
                     data-date="${dateStr}">
                    ${i}
                    ${hasEvents ? '<span class="event-dot"></span>' : ''}
                </div>
            `);
        }

        this.container.querySelector('.days').innerHTML = daysHTML.join('');

        // Ajout des événements sur les jours
        this.container.querySelectorAll('.day:not(.empty)').forEach(day => {
            day.addEventListener('click', () => {
                this.selectDate(day.dataset.date);
            });
        });
    }

    selectDate(dateStr) {
        this.selectedDate = dateStr;
        this.render();
        this.showEvents(dateStr);
    }

    showEvents(dateStr) {
        const eventsList = this.container.querySelector('.events-list');
        const events = this.events.get(dateStr) || [];
        
        eventsList.innerHTML = events.map(event => `
            <div class="event-item">
                <div class="event-time">${event.time}</div>
                <div class="event-title">${event.title}</div>
                <button class="delete-event" data-id="${event.id}">×</button>
            </div>
        `).join('') || '<p>Aucun événement ce jour</p>';
    }

    showAddEventModal() {
        const modal = document.createElement('div');
        modal.className = 'calendar-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Ajouter un rendez-vous</h3>
                <form id="add-event-form">
                    <input type="date" required value="${this.selectedDate || ''}">
                    <input type="time" required>
                    <input type="text" placeholder="Titre du rendez-vous" required>
                    <textarea placeholder="Description (optionnel)"></textarea>
                    <div class="modal-buttons">
                        <button type="button" class="cancel">Annuler</button>
                        <button type="submit">Ajouter</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.cancel').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const date = form.querySelector('input[type="date"]').value;
            const event = {
                id: Date.now(),
                time: form.querySelector('input[type="time"]').value,
                title: form.querySelector('input[type="text"]').value,
                description: form.querySelector('textarea').value
            };

            if (!this.events.has(date)) {
                this.events.set(date, []);
            }
            this.events.get(date).push(event);
            
            this.render();
            this.showEvents(date);
            modal.remove();
        });
    }
}

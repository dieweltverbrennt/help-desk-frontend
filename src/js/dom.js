export default class Dom {
  constructor() {
    this.dom = null;
    this.container = null;
    this.addTicketButton = null;
    this.ticketList = null;
  }

  drawContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('container');
    document.body.appendChild(this.container);
  }

  drawButton() {
    this.addTicketButton = document.createElement('button');
    this.addTicketButton.classList.add('container__add-btn');
    this.addTicketButton.textContent = 'Добавить тикет';
    this.container.appendChild(this.addTicketButton);
  }

  drawTicketContainer() {
    const ticketContainer = document.createElement('div');
    ticketContainer.classList.add('ticket-container');

    this.ticketList = document.createElement('ul');
    this.ticketList.classList.add('ticket-container__list');
    ticketContainer.appendChild(this.ticketList);

    this.container.appendChild(ticketContainer);
  }

  addTicket(id, text, date, fullText) {
    const ticket = document.createElement('li');
    ticket.id = id;
    ticket.classList.add('ticket-container__item');
    ticket.innerHTML = `
    <input class="checkbox" type="checkbox"></input>
    <p>${text}</p>
    <span class="date">${date}</span>
    <button class="redact list-btn">&#9998;</button>
    <button class="delete list-btn">&#10006;</button>
    <p class="full-text hidden">${fullText}</p>`;

    this.ticketList.appendChild(ticket);
  }
}

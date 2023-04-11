export default class AppController {
  constructor(dom, modal, api) {
    this.dom = dom;
    this.modal = modal;
    this.api = api;
  }

  init() {
    this.dom.drawContainer();
    this.dom.drawButton();
    this.dom.drawTicketContainer();

    this.api.allTickets((item) => {
      item.forEach((i) => {
        this.api.ticketById(i.id, (ticket) => {
          this.dom.addTicket(ticket.id, ticket.name, ticket.created, ticket.description);
          const newTicket = document.querySelector('.ticket-container__list').lastChild;
          this.bindTicketEvents(newTicket);
          if (i.status === true) {
            newTicket.querySelector('.checkbox').checked = true;
          }
        });
      });
    });

    this.dom.addTicketButton.addEventListener('click', this.addTicketButtonClick.bind(this));
  }

  addTicketButtonClick(e) {
    e.preventDefault();
    this.modal.createAddTicketModal();
    const escapeBtn = this.modal.container.querySelector('.escape');
    escapeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this.modal.container.remove();
      this.modal.container = null;
    });

    const okBtn = this.modal.container.querySelector('.add-ok');
    okBtn.addEventListener('click', this.confirmAddTicket.bind(this));
  }

  confirmAddTicket(e) {
    e.preventDefault();
    const text = document.querySelector('form').querySelector('input').value;
    const fullText = document.querySelector('textarea').value;

    this.api.createTicket(text, fullText, (data) => {
      this.dom.addTicket(data.id, text, data.created, fullText);
      const newTicket = document.querySelector('.ticket-container__list').lastChild;
      this.bindTicketEvents(newTicket);

      this.modal.container.remove();
    });
  }

  bindTicketEvents(item) {
    item.addEventListener('click', (e) => {
      if (!e.target.classList.contains('checkbox') && !e.target.classList.contains('list-btn')) {
        e.target.closest('.ticket-container__item').querySelector('.full-text').classList.toggle('hidden');
      }
      if (e.target.classList.contains('redact')) {
        const lastText = item.querySelector('p').textContent;
        const lastFullText = item.querySelector('.full-text').textContent;
        this.modal.createRedactTicketModal(lastText, lastFullText);

        const escapeBtn = this.modal.container.querySelector('.escape');
        escapeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.modal.container.remove();
          this.modal.container = null;
        });

        const okBtn = this.modal.container.querySelector('.add-ok');
        okBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const text = e.target.closest('form').querySelector('input').value;
          const fullText = e.target.closest('form').querySelector('textarea').value;
          this.api.editTicket(item.id, text, fullText, () => {
            item.querySelector('p').textContent = text;
            item.querySelector('.full-text').textContent = fullText;
            this.modal.container.remove();
            this.modal.container = null;
          });
        });
      }
      if (e.target.classList.contains('delete')) {
        this.modal.createDeleteTicketModal();
        const escapeBtn = this.modal.container.querySelector('.escape');
        escapeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.modal.container.remove();
          this.modal.container = null;
        });

        const okBtn = this.modal.container.querySelector('.add-ok');
        okBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.api.deleteTicket(item.id, (ticket) => {
            item.remove();
            this.modal.container.remove();
            this.modal.container = null;
          });
        });
      }
      if (e.target.classList.contains('checkbox')) {
        this.api.changeStatus(item.id, () => {
        });
      }
    });
  }
}

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/dom.js
class Dom {
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
;// CONCATENATED MODULE: ./src/js/appController.js
class AppController {
  constructor(dom, modal, api) {
    this.dom = dom;
    this.modal = modal;
    this.api = api;
  }
  init() {
    this.dom.drawContainer();
    this.dom.drawButton();
    this.dom.drawTicketContainer();
    this.api.allTickets(item => {
      item.forEach(i => {
        this.api.ticketById(i.id, ticket => {
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
    escapeBtn.addEventListener('click', e => {
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
    this.api.createTicket(text, fullText, data => {
      this.dom.addTicket(data.id, text, data.created, fullText);
      const newTicket = document.querySelector('.ticket-container__list').lastChild;
      this.bindTicketEvents(newTicket);
      this.modal.container.remove();
    });
  }
  bindTicketEvents(item) {
    item.addEventListener('click', e => {
      if (!e.target.classList.contains('checkbox') && !e.target.classList.contains('list-btn')) {
        e.target.closest('.ticket-container__item').querySelector('.full-text').classList.toggle('hidden');
      }
      if (e.target.classList.contains('redact')) {
        const lastText = item.querySelector('p').textContent;
        const lastFullText = item.querySelector('.full-text').textContent;
        this.modal.createRedactTicketModal(lastText, lastFullText);
        const escapeBtn = this.modal.container.querySelector('.escape');
        escapeBtn.addEventListener('click', e => {
          e.preventDefault();
          this.modal.container.remove();
          this.modal.container = null;
        });
        const okBtn = this.modal.container.querySelector('.add-ok');
        okBtn.addEventListener('click', e => {
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
        escapeBtn.addEventListener('click', e => {
          e.preventDefault();
          this.modal.container.remove();
          this.modal.container = null;
        });
        const okBtn = this.modal.container.querySelector('.add-ok');
        okBtn.addEventListener('click', e => {
          e.preventDefault();
          this.api.deleteTicket(item.id, ticket => {
            item.remove();
            this.modal.container.remove();
            this.modal.container = null;
          });
        });
      }
      if (e.target.classList.contains('checkbox')) {
        this.api.changeStatus(item.id, () => {});
      }
    });
  }
}
;// CONCATENATED MODULE: ./src/js/modal.js
class Modal {
  constructor() {
    this.container = null;
  }
  createContainer() {
    this.container = document.createElement('div');
    this.container.classList.add('modal-container');
    document.body.appendChild(this.container);
  }
  createAddTicketModal() {
    this.createContainer();
    this.container.innerHTML = `<h3>Добавить тикет</h3>
    <form>
    <p>Краткое описание</p>
    <input type="text"></input>
    <p>Подробное описание</p>
    <textarea></textarea>
    <div class="modal-btn-group">
    <button class="modal-btn escape">Отмена</button>
    <button class="modal-btn add-ok">Ok</button>
    </div>
    </form>`;
    this.container.style.top = `${window.innerHeight / 2 - this.container.offsetHeight / 2}px`;
    this.container.style.left = `${window.innerWidth / 2 - this.container.offsetWidth / 2}px`;
  }
  createRedactTicketModal(lastText, lastFullText) {
    this.createContainer();
    this.container.innerHTML = `<h3>Изменить тикет</h3>
    <form method='POST' action=''>
    <p>Краткое описание</p>
    <input type="text" value="${lastText}"></input>
    <p>Подробное описание</p>
    <textarea>${lastFullText}</textarea>
    <div class="modal-btn-group">
    <button class="modal-btn escape">Отмена</button>
    <button class="modal-btn add-ok">Ok</button>
    </div>
    </form>`;
    this.container.style.top = `${window.innerHeight / 2 - this.container.offsetHeight / 2}px`;
    this.container.style.left = `${window.innerWidth / 2 - this.container.offsetWidth / 2}px`;
  }
  createDeleteTicketModal() {
    this.createContainer();
    this.container.innerHTML = `<h3>Удалить тикет</h3>
    <p>Вы уверены, что хотите удалить тикет? Это действие необратимо.</p>
    <div class="modal-btn-group">
    <button class="modal-btn escape">Отмена</button>
    <button class="modal-btn add-ok">Ok</button>
    </div>`;
    this.container.style.top = `${window.innerHeight / 2 - this.container.offsetHeight / 2}px`;
    this.container.style.left = `${window.innerWidth / 2 - this.container.offsetWidth / 2}px`;
  }
}
;// CONCATENATED MODULE: ./src/js/api.js
class Api {
  constructor() {
    this.options = null;
    this.baseURL = 'http://localhost:7070/';
  }
  createTicket(text, fullText, callback) {
    const params = new FormData();
    params.append('text', `${text}`);
    params.append('fullText', `${fullText}`);
    this.options = {
      method: 'POST',
      query: 'method=createTicket',
      data: params
    };
    return this.createRequest(this.options, callback);
  }
  allTickets(callback) {
    this.options = {
      method: 'GET',
      query: 'method=allTickets',
      data: null
    };
    return this.createRequest(this.options, callback);
  }
  changeStatus(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=changeStatus&id=${id}`,
      data: null
    };
    return this.createRequest(this.options, callback);
  }
  ticketById(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=ticketById&id=${id}`,
      data: null
    };
    return this.createRequest(this.options, callback);
  }
  editTicket(id, text, fullText, callback) {
    const params = new FormData();
    params.append('id', `${id}`);
    params.append('text', `${text}`);
    params.append('fullText', `${fullText}`);
    this.options = {
      method: 'POST',
      query: 'method=editTicket',
      data: params
    };
    return this.createRequest(this.options, callback);
  }
  deleteTicket(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=deleteTicket&id=${id}`,
      data: null
    };
    return this.createRequest(this.options, callback);
  }
  createRequest(options, callback) {
    const xhr = new XMLHttpRequest();
    const url = `${this.baseURL}?${this.options.query}`;
    xhr.open(options.method, url);
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback(data);
        } catch (e) {
          console.error(e);
        }
      }
    });
    xhr.send(options.data);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js




const dom = new Dom();
const modal = new Modal();
const api = new Api();
const appController = new AppController(dom, modal, api);
appController.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
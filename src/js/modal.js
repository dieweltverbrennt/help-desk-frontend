export default class Modal {
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

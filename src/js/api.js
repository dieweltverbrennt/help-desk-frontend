export default class Api {
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
      data: params,
    };
    return this.createRequest(this.options, callback);
  }

  allTickets(callback) {
    this.options = {
      method: 'GET',
      query: 'method=allTickets',
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  changeStatus(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=changeStatus&id=${id}`,
      data: null,
    };
    return this.createRequest(this.options, callback);
  }

  ticketById(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=ticketById&id=${id}`,
      data: null,
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
      data: params,
    };

    return this.createRequest(this.options, callback);
  }

  deleteTicket(id, callback) {
    this.options = {
      method: 'GET',
      query: `method=deleteTicket&id=${id}`,
      data: null,
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

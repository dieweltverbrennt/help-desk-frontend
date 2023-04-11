import Dom from './dom';
import AppController from './appController';
import Modal from './modal';
import Api from './api';

const dom = new Dom();
const modal = new Modal();
const api = new Api();
const appController = new AppController(dom, modal, api);

appController.init();

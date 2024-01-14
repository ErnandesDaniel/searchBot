import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PiniaRouter from "pinia-plugin-router";
import './shared/assets/reset.css';

const app=createApp(App);
const Pinia=createPinia();
Pinia.use(PiniaRouter(router));
app.use(Pinia);

import { loading } from '@/shared/services/loading.js';

//Импорт всех модулей
import autorizationModule from "./modules/autorization";
import profileModule from "./modules/profile";
import siteModule from "./modules/sites";

//Импортируем функцию для регистрации модулей
import { registerModules } from "./registerModules";

//Регистрируем модули (в основном добавляем нужные нам данные для маршрутов)
registerModules([

  autorizationModule, 
  
  siteModule,

  profileModule,

]);


//Активируем router после Pinia, чтобы магазины Pinia можно было 
//использовать в router
console.log('Загрузка данных приложения');
//Загружаем основные данные приложения
loading();
//Необходимо в начале загружить все данные приложения, чтобы
//после этого произвести все перенаправления
app.use(router);
app.mount('#app');


import { createRouter, createWebHistory } from 'vue-router'

import { useMainDataStore } from '@/shared/stores/mainData.js'

import { computed } from 'vue'

const routes = [

  {

    path: '/',

    //При попытке перейти на стартовую страницу приложения
    //Переходим на соответствующие начальные страницы

    redirect:(to)=>{

		console.log('Перенаправление');

		let mainDataStore=useMainDataStore();
	  
		//Получаем статус авторизации пользователя
		let isAuth=computed(()=>mainDataStore.statusOfAuthorization).value;
		
		if(isAuth==true){

			return {path:'/siteList'}
			
		}else if(isAuth==false){

			return {path:'/autorization'}

		}

    },

  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


//Регистрируем глобальный защитник путей
router.beforeEach((to, from)=>{

	//Если пользователь вводит несуществующий путь, то происходит редирект на главную
	//страницу, а с нее идет редирект куда нужно
	if(to.matched.length === 0){
	
		return{path:'/', replace:true};

	}
	
	let mainDataStore=useMainDataStore();

	//Получаем статус авторизации пользователя
	let isAuth=computed(()=>mainDataStore.statusOfAuthorization).value;
  
	//Получаем информацию о необходимом статусе авторизации
	//для доступа к данной странице
	let requiredAuthStatus=to.meta.requiredAuthStatus;

	//Функция для отказа в доступе к определенной странице
	let accessDenied=()=>{

		//Если имя прошлой страницы определено, то переходим на нее
		if(from.name!=null){

			return {name:from.name, replace:true};
			  
		//Иначе, если имя прошлой страницы равно null, то переходим на стартовую страницу
		}else{

			return {path:'/', replace:true};

		}

	}
  
	//Если статус авторизации не равен необходимому статусу авторизации
	//то отменяем доступ пользователя к данной странице

	if(requiredAuthStatus==null){

		//Доступ всегда
		console.log('Доступ всегда');
		
		return true;

	}else if(requiredAuthStatus==false && isAuth==false){
		
		//Доступ только неавторизованным пользователям
		console.log('Доступ только неавторизованным пользователям');

		return true;

	//При этом requiredAuthStatus==true
	//и isAuth должен быть равен true
	}else if(isAuth==true && requiredAuthStatus==true){
		
		//Доступ только с авторизацией
		console.log('Доступ только с авторизацией');
		
		return true;

	}else{

		return accessDenied();

	}
	
});

export default router

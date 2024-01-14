
import { defineStore } from 'pinia'

import { setAxiosAuthorizationHeader } from '@/shared/axios.js'

export const useAutorizationStore = defineStore('autorization',{

	state:()=>{
		
		return{

			//Во время авторизации необходимо сохранить email и пароль в оперативной памяти
			email:'',

			password:'',

			//Храним токен доступа в оперативной памяти
			authorizationToken:'',

			//Настройки приложения по умолчанию
			statusOfAuthorization:false,

			//statusOfAuthorization:true,

			//Выбранный на странице авторизации блок для отображения - сохраняется в
			//постоянной памяти - по умолчанию отображается блок регистрации
			//authorizationSelectedBlock:'registration',

			authorizationSelectedBlock:'authorization',

		}
		
	},

	actions:{

		//Данные необходимые для подтверждения email пользователя - email,
		//password - используетя только для подтверждения регистрации пользователя
		setAutorizationData(email,password){

			this.email=email;

			this.password=password;

		},

		setAuthorizationSelectedBlock(authorizationSelectedBlock){

			this.authorizationSelectedBlock=authorizationSelectedBlock;
	
		},

		setRoleSelectedBlock(roleSelectedBlock){

			this.role=roleSelectedBlock;
	
		},

		//Функция для разлогинирования и удаления необходимых данных - сброса состояния
		//локальной базы данных до состояния без записей пользователя
		async logOut(){

			this.statusOfAuthorization=false;

			this.authorizationToken='';

			setAxiosAuthorizationHeader('');
         	
		},

		logIn(authorizationToken){

			//Записываем статус авторизации
			this.statusOfAuthorization=true;

			//Записываем токен авторизации в оперативной памяти
			this.authorizationToken=authorizationToken;

			//Декодируем base64 строку токена и получаем полезную нагрузку
			//в виде JS-объекта
			let decodedToken=JSON.parse(atob(authorizationToken.split('.')[1]));


			setAxiosAuthorizationHeader(authorizationToken);

		},


		//Функция для проверки валидности токена авторизации - используется для
		//проверки токена авторизации перед попыткой налаживания соединения с сервером
		checkAuthorizationToken(){


		},


		setProfileCanBeChanged(bolleanValue){

			this.profileCanBeChanged=bolleanValue;

		},

		setNameOfPage(newNameOfPage){

			this.nameOfPage=newNameOfPage;

		},
		
	},

})
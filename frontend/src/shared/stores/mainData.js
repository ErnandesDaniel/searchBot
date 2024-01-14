
import { defineStore } from 'pinia'

import { useAutorizationStore } from '@/modules/autorization'

export const useMainDataStore = defineStore('mainData',{

	state:()=>{
		
		return{

			//Настройки приложения по умолчанию
			statusOfAuthorization:false,

			//statusOfAuthorization:true,

			//Храним токен доступа в оперативной памяти
			//authorizationToken:'',
			
			name:'',
			
			errorMessageText:'',

			nameOfPage:'',

			analyzedSites:[

				{

					name:'Avito',

					requestCharacteristics:[
						
						{
							name:'description',

							description:'Описание сути запроса'

						},

						{
							name:'linkWithData',

							description:'Приоритетная ссылка для поиска',

							canBeEmpty:true,

						},


						{
							name:'requestText',

							description:'Текст запроса'

						},

						{
							name:'minimumObjectPrice',

							type:'Number',

							description:'Минимальная цена'

						},
						
						{
							name:'maximumObjectPrice',

							type:'Number',

							description:'Максимальная цена'

						},

						{
							name:'differenceFromCurrentDay',

							type:'Number',

							description:'За сколько дней назад относительно текущей даты учитывать товары'

						},

					],
				},


				{

					name:'FunPay',

					requestCharacteristics:[

						{
							name:'description',

							description:'Описание сути запроса'

						},


						{
							name:'href',

							description:'Ссылка на саму HTML-страницу с товарами'

						},

						{
							name:'maximumObjectPrice',

							type:'Number',

							description:'Максимальная цена объекта'

						},

					],
				},

			],


		}
		
	},

	getters:{


    	statusOfAuthorization(){

    		const autorizationStore = useAutorizationStore();

			return autorizationStore.statusOfAuthorization;

    	},

    	authorizationToken(){

    		const autorizationStore = useAutorizationStore();

			return autorizationStore.authorizationToken;


    	},

  	},

	actions:{
		
		setMainDataOfUser(mainDataOfUser){
			
			this.name=mainDataOfUser.name;

		},


		setProfileCanBeChanged(bolleanValue){

			this.profileCanBeChanged=bolleanValue;

		},

		setNameOfPage(newNameOfPage){

			this.nameOfPage=newNameOfPage;

		},
		
		setErrorMessageText(errorMessageText){

			this.errorMessageText=errorMessageText;
			
		},
		
	},

})
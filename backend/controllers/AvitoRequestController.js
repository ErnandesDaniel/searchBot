
const Ajv = require("ajv");

const ajv = new Ajv();

//Подключаем функцию для создания токенов
const tokens=require('../utils/token.js');

//Подключаем модели
const {
	
	userModel,

	Avito_ObjectModel,

	Avito_KeywordsInObjectDescriptionModel,

	Avito_RequestModel,
	
	
} = require('../models/models');

class AvitoRequestController{

	async create(req, res){

		//Получаем данные из объекта тела запроса пользователя
		let data=req.body;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema={
			
			type:'object',
			
			properties:{
				
				//Описание запроса
				description:{ type:'string' },
				
				//Поиск информации по ссылке
				linkWithData:{ type:'string' },
				
				//Текст запроса
				requestText:{ type:'string' },	
				
				//Минимальная цена объекта
				minimumObjectPrice:{ type:'integer' },	
				
				//Максимальная цена объекта
				maximumObjectPrice:{ type:'integer' },	
				
				//За сколько дней назад относительно текущей даты учитывать товары
				differenceFromCurrentDay:{ type:'integer' },			
				
				keywordsInObjectDescription:{ type:'array' },
				
			},
			
			required:[
			
				'description',
			
				'requestText',
				
				'linkWithData',

				'minimumObjectPrice',	

				'maximumObjectPrice',	

				'differenceFromCurrentDay',			
				
				'keywordsInObjectDescription',
				
			
			],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			let token=req.token;
				
			//Получаем декодированный токен пользователя
			let decodedToken=tokens.getDecodedToken(token);	
				
			//Получаем email пользователя из токена
			let id=decodedToken.id;

			//Получаем объект пользователя (заказчика) по id
			let user=await userModel.findOne({where:{id:id}});
			
			//Создаем запрос в базе данных
			const newAvitoRequest=await user.createAvito_Request({
				
				description:data.description,
				
				linkWithData:data.linkWithData,
				
				requestText:data.requestText,

				minimumObjectPrice:data.minimumObjectPrice,	

				maximumObjectPrice:data.maximumObjectPrice,	

				differenceFromCurrentDay:data.differenceFromCurrentDay,
				
			});
			
			//Создаем связанные с запросом ключевые слова
			 for(let Keywords of data.keywordsInObjectDescription){
				 
				await newAvitoRequest.createAvito_KeywordsInObjectDescription({
					
					Keywords:Keywords
					
				});
				
			}
								
			res.send({errorExist:false, actionMessage:'requestWasCreated', 
				
				content:{
					
					id:newAvitoRequest.id,
					
				}
				
			});

		}
		
	};

	async update(req, res){
		
		//Получаем данные из объекта тела запроса пользователя
		let data=req.body;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				id:{ type:'integer' },
				
				description:{ type:'string' },
				
				//Поиск информации по ссылке
				linkWithData:{ type:'string' },
				
				//Текст запроса
				requestText:{ type:'string' },	
				
				//Минимальная цена объекта
				minimumObjectPrice:{ type:'integer' },	
				
				//Максимальная цена объекта
				maximumObjectPrice:{ type:'integer' },	
				
				//За сколько дней назад относительно текущей даты учитывать товары
				differenceFromCurrentDay:{ type:'integer' },			
				
				keywordsInObjectDescription:{ type:'array' },
				
				//При изменении данных запроса нужно ли удалять ТЕПЕРЬ неподходящие объекты
				//deleteUnsuitableObjects:{ type:'boolean' },
				
			},
			
			required:[
				
				'id',
				
				'description',	
				
				'linkWithData',
				
				'requestText',

				'minimumObjectPrice',	

				'maximumObjectPrice',	

				'differenceFromCurrentDay',			
				
				'keywordsInObjectDescription',
			
			],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			let token=req.token;
				
			//Получаем декодированный токен пользователя
			let decodedToken=tokens.getDecodedToken(token);	
				
			//Получаем email пользователя из токена
			let userId=decodedToken.id;

			//Получаем объект пользователя (заказчика) по id
			let user=await userModel.findOne({where:{id:userId}});
			
			let AvitoRequest=(await user.getAvito_Requests({
				
				attributes:[
					
					'id',

					'linkWithData',
					
					'description',	
					
					'requestText',

					'minimumObjectPrice',	

					'maximumObjectPrice',	

					'differenceFromCurrentDay',	
					
				],
				
				where:{
					
					id:data.id,
					
				},
				
			}))[0];
			
			if(AvitoRequest!=null){
			
				//Изменяем данные запроса
				await AvitoRequest.update({
					
					description:data.description,
					
					requestText:data.requestText,
									
					linkWithData:data.linkWithData,	

					minimumObjectPrice:data.minimumObjectPrice,	

					maximumObjectPrice:data.maximumObjectPrice,	

					differenceFromCurrentDay:data.differenceFromCurrentDay,				
					
				});
				
				//Удаляем все ключевые слова связанные с данным запросом
				Avito_KeywordsInObjectDescriptionModel.destroy({
					
					where:{AvitoRequestId:AvitoRequest.id}
					
				});
				
				//Создаем массив ключевых слов для добавления в базу данных
				let arrayOfKeywordsFromClient=data.keywordsInObjectDescription.map((el)=>{
					
					return{
						
						Keywords:el,
						
						AvitoRequestId:AvitoRequest.id,
						
					}
					
				});
				
				//Добавляем в базу данных новые ключевые слова связанные с данным запросом
				await Avito_KeywordsInObjectDescriptionModel.bulkCreate(arrayOfKeywordsFromClient);
								
				res.send({errorExist:false, actionMessage:'requestWasUpdated', 
					
					content:{
						
						id:AvitoRequest.id,
						
					}
					
				});
			
			}else if(AvitoRequest==null){
				
				res.send({errorExist:true, actionMessage:'requestIsNotExist'});
				
			}

		}
	};

	async delete(req, res){
		
		//Получаем данные из объекта запроса пользователя
		let data=req.params;
			
		let token=req.token;
			
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
		
		//Получаем объект пользователя по id
		let user=await userModel.findOne({
			
			where:{id:decodedToken.id},
			
		});
		
		//Получаем список объектов запроса (по Id находится лишь один) пользователя
		let AvitoRequest=(await user.getAvito_Requests({

			attributes:['id',],

			where:{id:data.id}

		}))[0];
		
		//Если объект запроса у данного пользователя найден, то он действительно принадлежит пользователю,
		//можно удалять связанные с объектом запроса товары и ключевые слова
		if(AvitoRequest!=null){
			
			//Удаляем найденные объекты, связаные с запросом
			Avito_ObjectModel.destroy({
				
				where:{
					
					AvitoRequestId:AvitoRequest.id
					
				}
				
			});
			
			//Удаляем ключевые слова, связаные с запросом
			Avito_KeywordsInObjectDescriptionModel.destroy({
				
				where:{
					
					AvitoRequestId:AvitoRequest.id
					
				}	
				
			});
			
			//Удаляем объект запроса
			await AvitoRequest.destroy();
			
			res.send({errorExist:false, actionMessage:'RequestWasDeleted'});
			
		}else{

			res.send({errorExist:true, actionMessage:'RequestIsNotExist'});
			
		}
		
	};
	
	
	async getAll(req, res){
			
		let token=req.token;
			
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
			
		//Получаем id пользователя из токена
		let id=decodedToken.id;
				
		//Получаем объект пользователя по токену
		let user=await userModel.findOne({where:{id:id}});
			
		let listOfMyAvitoRequests=await user.getAvito_Requests({
			
			include:Avito_KeywordsInObjectDescriptionModel,
			
			order:[
			
				['id', 'DESC'],
            
			],
			
		});
			
		//Формируем массив заказов для его отображения на стороне клиента
		listOfMyAvitoRequests=listOfMyAvitoRequests.map((AvitoRequest)=>{
	
			let formattedAvitoRequest={
								
				id:AvitoRequest.id,
				
				description:AvitoRequest.description,
				
				linkWithData:AvitoRequest.linkWithData,
					
				requestText:AvitoRequest.requestText,

				minimumObjectPrice:AvitoRequest.minimumObjectPrice,	

				maximumObjectPrice:AvitoRequest.maximumObjectPrice,	

				differenceFromCurrentDay:AvitoRequest.differenceFromCurrentDay,						
				
				keywordsInObjectDescription:[],
										
			};
			
			//Получаем массив ключевых слов, связанных с объектом
			let KeywordsArray=AvitoRequest.Avito_KeywordsInObjectDescriptions;			
			
			KeywordsArray=KeywordsArray.map((KeywordObject)=>{
				
				return KeywordObject.Keywords;	
				
			});
			
			formattedAvitoRequest.keywordsInObjectDescription=KeywordsArray;

			return formattedAvitoRequest;		
				
		});
				
		res.send({
					
			errorExist:false,
					
			content:{
						
				listOfObjects:listOfMyAvitoRequests,
						
			}
					
		});
		
	};
	
}

module.exports = new AvitoRequestController();

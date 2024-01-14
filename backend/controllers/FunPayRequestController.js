
const Ajv = require("Ajv");

const ajv = new Ajv();

//Подключаем функцию для создания токенов
const tokens=require('../utils/token.js');

//Подключаем модели
const {
	
	userModel,

	FunPay_ObjectModel,

	FunPay_KeywordsInObjectDescriptionModel,

	FunPay_RequestModel,
	
	
} = require('../models/models');

class FunPayRequestController{

	async create(req, res){

		//Получаем данные из объекта тела запроса пользователя
		let data=req.body;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				description:{ type:'string' },	
				
				href:{ type:'string' },	

				maximumObjectPrice:{ type:'integer' },				
				
				keywordsInObjectDescription:{ type:'array' },
				
			},
			
			required:[
			
				'description',
			
				'href',

				'maximumObjectPrice',			
				
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
			const newFunPayRequest=await user.createFunPay_Request({
				
				description:data.description,	
				
				href:data.href,

				maximumObjectPrice:data.maximumObjectPrice,
				
			});
			
			//Создаем связанные с запросом ключевые слова
			 for(let Keywords of data.keywordsInObjectDescription){
				 
				await newFunPayRequest.createFunPay_KeywordsInObjectDescription({
					
					Keywords:Keywords
					
				});
				
			}
								
			res.send({errorExist:false, actionMessage:'requestWasCreated',
				
				content:{
					
					id:newFunPayRequest.id,
					
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
				
				href:{ type:'string' },

				maximumObjectPrice:{ type:'integer' },				
				
				keywordsInObjectDescription:{ type:'array' },
				
				//При изменении данных запроса нужно ли удалять ТЕПЕРЬ неподходящие объекты
				//deleteUnsuitableObjects:{ type:'boolean' },
				
			},
			
			required:[
				
				'id',
			
				'description',	
			
				'href', 

				'maximumObjectPrice',			
				
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
			
			let FunPayRequest=(await user.getFunPay_Requests({
				
				attributes:[
					
					'id',
					
					'description',	
					
					'href', 

					'maximumObjectPrice',
					
				],
				
				where:{
					
					id:data.id,
					
				},
				
			}))[0];
			
			if(FunPayRequest!=null){
			
				//Изменяем данные запроса
				await FunPayRequest.update({
					
					description:data.description,	
					
					href:data.href,

					maximumObjectPrice:data.maximumObjectPrice,
					
				});
				
				//Удаляем все ключевые слова связанные с данным запросом
				FunPay_KeywordsInObjectDescriptionModel.destroy({
					
					where:{FunPayRequestId:FunPayRequest.id}
					
				});
				
				//Создаем массив ключевых слов для добавления в базу данных
				let arrayOfKeywordsFromClient=data.keywordsInObjectDescription.map((el)=>{
					
					return{
						
						Keywords:el,
						
						FunPayRequestId:FunPayRequest.id,
						
					}
					
				});
				
				//Добавляем в базу данных новые ключевые слова связанные с данным запросом
				await FunPay_KeywordsInObjectDescriptionModel.bulkCreate(arrayOfKeywordsFromClient);
								
				res.send({errorExist:false, actionMessage:'requestWasUpdated', 
					
					content:{
						
						id:FunPayRequest.id,
						
					}
					
				});
			
			}else if(FunPayRequest==null){
				
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
		let FunPayRequest=(await user.getFunPay_Requests({

			attributes:['id',],

			where:{id:data.id},

		}))[0];
		
		//Если объект запроса у данного пользователя найден, то он действительно принадлежит пользователю,
		//можно удалять связанные с объектом запроса товары и ключевые слова
		if(FunPayRequest!=null){
	
			await FunPay_ObjectModel.destroy({
				
				where: {
					
					FunPayRequestId:FunPayRequest.id
					
				}
				
			});

			await FunPay_KeywordsInObjectDescriptionModel.destroy({
				
				where:{
					
					FunPayRequestId:FunPayRequest.id
					
				}	
				
			});
			
			//Удаляем объект запроса
			await FunPayRequest.destroy();
			
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
			
		let listOfMyFunPayRequests=await user.getFunPay_Requests({
			
			include:FunPay_KeywordsInObjectDescriptionModel,
			
			order:[
			
				['id', 'DESC'],
            
			],
			
		});
			
		//Формируем массив заказов для его отображения на стороне клиента
		listOfMyFunPayRequests=listOfMyFunPayRequests.map((FunPayRequest)=>{
	
			let formattedFunPayRequest={
								
				id:FunPayRequest.id,
				
				description:FunPayRequest.description,
				
				href:FunPayRequest.href,

				maximumObjectPrice:FunPayRequest.maximumObjectPrice,

				keywordsInObjectDescription:[],
										
			};
			
			//Получаем массив ключевых слов, связанных с объектом
			let KeywordsArray=FunPayRequest.FunPay_KeywordsInObjectDescriptions;			
			
			KeywordsArray=KeywordsArray.map((KeywordObject)=>{
				
				return KeywordObject.Keywords;	
				
			});
			
			formattedFunPayRequest.keywordsInObjectDescription=KeywordsArray;

			return formattedFunPayRequest;		
				
		});
				
		res.send({
					
			errorExist:false,
					
			content:{
						
				listOfObjects:listOfMyFunPayRequests,
						
			}
					
		});
		
	};
	
}

module.exports = new FunPayRequestController();

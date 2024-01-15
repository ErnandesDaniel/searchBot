
const Ajv = require("ajv");

const ajv = new Ajv();

//Подключаем функции для пагинации
const pagination=require('../utils/pagination.js');

//Подключаем функцию для создания токенов
const tokens=require('../utils/token.js');

//Подключаем модели
const { userModel, FunPay_ObjectModel } = require('../models/models');

class FunPayObjectController{
	
	async update(req, res){
		
		//Получаем данные из объекта тела запроса пользователя
		let data=req.body;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{

				objectId:{type:'integer'},
				
				viewed:{ type: 'boolean'},
				
			},
			
			required: ['objectId', 'viewed'],

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
			
			let requestId=req.params.requestId;
			
			let objectId=data.objectId;
			
			let viewed=data.viewed;

			let user=await userModel.findOne({
				
				where:{id:decodedToken.id}
				
			});
			
			if(user!=null){
			
				let request=(await user.getFunPay_Requests({
					
					where:{id:requestId},
					
				}))[0];
			
				if(request!=null){
					
					let object=(await request.getFunPay_Objects({
						
						where:{id:objectId},
						
					}))[0];
					
					if(object!=null){
						
						//Делаем объект невидимым в интерфейсе
						object.update({viewed:viewed});
						
						res.send({errorExist:false, actionMessage:'objectWasUpdated'});
						
					}else{
						
						res.send({errorExist:false, actionMessage:'requestIsNotExist'});
						
					}
					
				}else{
					
					res.send({errorExist:true, actionMessage:'objectIsNotExist'});
					
				}
			
			}else{
				
				res.send({errorExist:true, actionMessage:'objectIsNotExist'});
				
			}
			
		}

	};
	

	async delete(req, res){
		
		//Получаем данные из объекта запроса пользователя
		let objectId=req.params.objectId;
		
		let requestId=req.params.requestId;
			
		let token=req.token;
			
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
		
		let user=await userModel.findOne({
			
			where:{id:decodedToken.id}
			
		});
		
		if(user!=null){
		
			let request=(await user.getFunPay_Requests({
				
				where:{id:requestId},
				
			}))[0];
		
			if(request!=null){
				
				let object=(await request.getFunPay_Objects({
					
					where:{id:objectId},
					
				}))[0];
				
				if(object!=null){
					
					//Делаем объект невидимым в интерфейсе
					object.update({hidden:true});
					
					res.send({errorExist:false, actionMessage:'objectWasDeleted'});
					
				}else{
					
					res.send({errorExist:false, actionMessage:'requestIsNotExist'});
					
				}
				
			}else{
				
				res.send({errorExist:true, actionMessage:'objectIsNotExist'});
				
			}
		
		}else{
			
			res.send({errorExist:true, actionMessage:'objectIsNotExist'});
			
		}
		
	};



	//Получить список найденных объектов для купле-продажи
	async getAll(req, res){
				
		//Получаем данные из объекта запроса пользователя
		let requestId=req.params.requestId;
		
		let token=req.token;
		
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
			
		//Получаем id пользователя из токена
		let id=decodedToken.id;
		
		//Получаем объект пользователя по токену
		let user=await userModel.findOne({where:{id:id}});	
		
		let request=(await user.getFunPay_Requests({
			
			where:{id:requestId},
			
		}))[0];
		
		//Получаем данные о текущей странице и ее размере
		const { page, size}=req.query;
		
		//Преобразовываем эти данные в данные для SQL-таблицы 
		const { limit, offset } = pagination.getPagination(page, size);
		
		const totalObjects=await request.countFunPay_Objects();
		
		//Получаем список объектов в соответствии с пагинацией
		let objectsInThisPage=await request.getFunPay_Objects({
			
			where:{
				
				hidden:false,
				
			},
			
			limit:limit,
			
			offset:offset,
			
			order:[
			
				['id', 'DESC'],
            
			],
			
		});
		
		let {
			
			totalPages,
			
			currentPage,
			
		}=pagination.getPagingData(totalObjects, page, limit);
		
		//Формируем массив объектов для его отображения на стороне клиента
		
		
		let listOfMyFunPayObjects=objectsInThisPage.map((FunPayObject)=>{
					
			let formattedFunPayObject={
							
					id:FunPayObject.id,
					
					idOnSite:FunPayObject.idOnSite,
					
					description:FunPayObject.description,
					
					viewed:FunPayObject.viewed,
					
					price:FunPayObject.price,
					
					detectionTime:FunPayObject.detectionTime,
									
			};

			return formattedFunPayObject;
				
		});
				
		res.send({
					
			errorExist:false,
					
			content:{
						
				listOfObjects:listOfMyFunPayObjects,
				
				totalObjects,
			
				totalPages,
			
				currentPage,
						
			}
					
		});
		
	};
	
}

module.exports = new FunPayObjectController();


const Ajv = require("Ajv");

const ajv = new Ajv();

//Подключаем модуль для проверки email
const emailValidator = require('email-validator');

//Подключаем функцию для работы с токенами
const tokens=require('../utils/token.js');

//Подключаем функцию для отправки сообщений на email пользователя
const sendConfirmationCode=require('../utils/sendConfirmationCode.js');

//Подключаем функцию для создания кода подтверждения
const createConfirmationCode=require('../utils/createConfirmationCode.js');

//Подключаем модели
const {userModel} = require('../models/models');

class UserController{

	async create(req, res){

		//Получаем данные из объекта тела запроса пользователя
		let data=req.body;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				email:{ type:'string' },
				
				password:{ type: 'string', minLength: 8,},

				name:{ type: 'string' },
				
			},
			
			required: ['email', 'password', 'name'],
			

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			//Получаем данные из объекта запроса пользователя
			let {email, password, name}=req.body;
			
			//Изменяем все буквы в email на строчные
			email=email.toLowerCase();
			
			//Проверяем email на корректность
			//Если email некорректный, то отправляем сообщение об ошибке
			if(emailValidator.validate(email)==false){
				
				//Отправляем ответ пользователю о том, что email некорректный
				res.send({errorExist:true, actionMessage:'invalidEmail'});
			
			//Иначе дальше продолжаем работу:
			}else{
				
				//Находим пользователя в базе данных
				const user=await userModel.findOne({
					
					attributes:['id','emailHasBeenConfirmed','confirmationCode'],
					
					where:{email:email}
				
				});
				
				function getRegistrationConfirmationLetter(req, name, confirmationToken){
					
					return `
					
					<h1>Подтверждение Email</h1>
					<h2>Привет, ${name}</h2>
					<p>Спасибо за вашу регистрацию. Пожалуйста, подтвердите свой Email, перейдя по ссылке ниже:</p>
					<a 
					
href='${req.headers.origin}/autorization/confirmRegistration?confirmationToken=${confirmationToken}'>
					Подтвердить Email</a>
					
					`;
					
				}
				
				//Если пользователь в таким Email не найден, то создаем нового пользователя
				if(user==null){
					
					//Создаем код подтвеждения
					let confirmationCode=createConfirmationCode();
					
					//Создаем пользователя в базе данных
					const newUser=await userModel.create({
							
						email:email, 
							
						password:password, 
							
						confirmationCode:confirmationCode,
							
						emailHasBeenConfirmed:false,
							
						name:name,
						
					});
					
					//Создаем токен подтверждения
					let confirmationToken=tokens.createToken({
							
						id:Number(newUser.id),
						
						confirmationCode:confirmationCode,
							
						iat:Date.now(),
							
					});
					
					//Создаем письмо для подтверждения регистрации
					let registrationConfirmationLetter=getRegistrationConfirmationLetter(req, name, confirmationToken);
					
					//Отправлям код подтвеждения регистрации на почту
					sendConfirmationCode(email, 'Подтверждение аккаунта', registrationConfirmationLetter);
					
					//Отправляем ответ пользователю о том, что
					//необходимо перейти на страницу подтверждения email
					res.send({errorExist:false, actionMessage:'checkEmail'});
					
				}else if(user!=null){
				//Если пользователь найден, то проверяем зарегистрирован ли его email
					
					//Если email пользователя НЕ был подтвержден, то 
					if(user.emailHasBeenConfirmed==false){
						
						//Изменяем данные о пользователе - имя пользователя и пароль, так как он еще неактивен 
						//и они могли измениться
						await user.update({

							name:name,
							
							password:password, 

						});
						
						//Получаем код подтверждения пользователя из полученного из базы данных
						//объект пользователя
						let confirmationCode=user.confirmationCode;
						
						//Создаем токен подтверждения
						let confirmationToken=tokens.createToken({
								
							id:Number(user.id),
							
							confirmationCode:confirmationCode,
								
							iat:Date.now(),
								
						});
						
						//Создаем письмо для подтверждения регистрации
						let registrationConfirmationLetter=getRegistrationConfirmationLetter(req, name, confirmationToken);
						
						//Отправлям код подтвеждения регистрации на почту
						sendConfirmationCode(email, 'Подтверждение аккаунта', registrationConfirmationLetter);
						
						//Отправляем ответ пользователю о том, что 
						//необходимо перейти на страницу подтвеждения email
						res.send({errorExist:false, actionMessage:'checkEmail'});
						
					//Если email пользователя был подтвержден, то отправляем пользователю сообщение
					//что необходимо использовать другой email
					}else if(user.emailHasBeenConfirmed==true){
						
						//Отправляем ответ пользователю о том, что пользователь создан
						res.send({errorExist:true, actionMessage:'userHasBeenAlreadyRegistered'});	
						
					}
						
				}
				
			}
			
		}
		
	};
	
    async getAuthorizationToken(req, res){

    	//Получаем данные из объекта запроса пользователя
		let data=req.query;

		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				email:{ type:'string' },
				
				password:{ type: 'string', minLength: 8,},
				
			},
			
			required: ['email', 'password'],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{

			//Получаем email из запроса
			let email=req.query.email;
		
			//Изменяем все буквы в email на строчные
			email=email.toLowerCase();
		
			let password=req.query.password;
		
			//Получаем данные пользователя (если пользователя нет, то получаем пустой ответ)
			const user=await userModel.findOne({
								
				attributes:['emailHasBeenConfirmed','password', 'id'],
								
				where:{email:email}
							
			});	
			
			if(user==null){
				
				//Отправляем ответ пользователю о том, что email некорректный
				res.send({errorExist:true, actionMessage:'userIsNotExist'});
				
			}else{
				
				if(user.emailHasBeenConfirmed==true){
					
					//Если пользователем отправлен пароль совпадающей с паролем в базе данных,
					//то отправляем пользователю токен доступа
					if(password==user.password){

						//Получаем id пользователя
						let id=user.id;
					
						//Создаем токен
						let token=tokens.createToken({
							
							id:Number(id),
							
							iat:Date.now(),
							
						});
						
						//Отправляем ответ пользователю с токеном авторизации
						res.send({errorExist:false, actionMessage:'tokenWasCreated', content:{token:token}});
					
					//Если пароль, отправленный пользователем, не совпадает с паролем в базе данных,
					//то сообщаем пользователю об ошибке
					}else if(password!=user.password){
						
						//Отправляем ответ пользователю о том, что email некорректный
						//Отправляем ответ пользователю о том, что email некорректный
						res.send({errorExist:true, actionMessage:'invalidPassword'});
						
					}
					
				}else if(user.emailHasBeenConfirmed==false){
					
					//Отправляем ответ пользователю о том, что email некорректный
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
					
				}
				
			}

		}
		
	}
	

    async getAuthorizationLink(req, res){
		
    	//Получаем данные из объекта запроса пользователя
		let data=req.query;
		
		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				email:{ type:'string' },
				
			},
			
			required: ['email',],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{

			//Получаем email из запроса
			let email=data.email;
			
			//Изменяем все буквы в email на строчные
			email=email.toLowerCase();
			
			//Проверяем email на корректность
			//Если email некорректный, то отправляем сообщение об ошибке
			if(emailValidator.validate(email)==false){
				
				//Отправляем ответ пользователю о том, что email некорректный
				res.send({errorExist:true, actionMessage:'invalidEmail'});
			
			//Иначе дальше продолжаем работу:
			}else{			

				//Получаем данные пользователя (если пользователя нет, то получаем пустой ответ)
				const user=await userModel.findOne({
									
					attributes:['emailHasBeenConfirmed','name', 'id'],
									
					where:{email:email}
								
				});	
				
				if(user==null){
					
					//Отправляем ответ пользователю о том, что email некорректный
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
					
				}else{
					
					if(user.emailHasBeenConfirmed==true){
						
						//Если пользователем отправлен пароль совпадающей с паролем в базе данных,
						//то отправляем пользователю токен доступа

						//Получаем id пользователя
						let id=user.id;
						
						let name=user.name;
							
						//Создаем код подтвеждения входа
						let loginConfirmationCode=createConfirmationCode();
							
						//Создаем токен для входа
						let loginConfirmationToken=tokens.createToken({
								
							id:Number(id),
								
							loginConfirmationCode:loginConfirmationCode,
								
							iat:Date.now(),
								
						});

						//Изменяем данные о пользователе - имя пользователя и пароль, так как он еще неактивен 
						//и они могли измениться
						await user.update({

							loginConfirmationCode:loginConfirmationCode,
								
						});
							
						let AuthorizationLinkLetter=`
						
						<h1>Вход по магической ссылке</h1>
						<h2>Привет, ${name}</h2>
						<p>Можете авторизоваться, перейдя по ссылке ниже</p>
						<a 
						
	href='${req.headers.origin}/autorization/logInByLink?loginConfirmationToken=${loginConfirmationToken}'>
						Войти по ссылке</a>
						
						`;				
						
						//Отправляем ссылку для входа в приложение на почту
						await sendConfirmationCode(email, 'Вход по одноразовой ссылке', AuthorizationLinkLetter);						
							
						//Отправляем ответ пользователю с токеном авторизации
						res.send({errorExist:false, actionMessage:'checkEmail'});
						
						
					}else if(user.emailHasBeenConfirmed==false){
						
						//Отправляем ответ пользователю о том, что email некорректный
						res.send({errorExist:true, actionMessage:'userIsNotExist'});
						
					}
					
				}
			
			}
		}	
		
	}

    async logInByLink(req, res){

    	//Получаем данные из объекта запроса пользователя
		let data=req.query;

		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				loginConfirmationToken:{ type:'string' },
				
			},
			
			required: ['loginConfirmationToken',],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			let loginConfirmationToken=data.loginConfirmationToken;
			
			//Проверяем токен подтверждения на валидность
			if(tokens.checkToken(loginConfirmationToken)=='TokenIsValid'){
			//Если токен валидный, то дальше обрабатываем ответ	
			
				//Декодируем токен
				let decodedToken=tokens.getDecodedToken(loginConfirmationToken);

				let idOfUser=decodedToken.id;
				
				let loginConfirmationCode=decodedToken.loginConfirmationCode;
				
				//Находим пользователя в базе данных
				const user=await userModel.findOne({
									
					attributes:['id','emailHasBeenConfirmed','loginConfirmationCode'],
									
					where:{id:idOfUser},
								
				});
				
				if(user==null){
					
					//Если пользователя нет в базе данных, то отправляем сообщение, что пользователь не найден
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
					
				}else if(user.emailHasBeenConfirmed==false){
								
					//Отправляем ответ пользователю о том, что регистрация пользователя уже была подтверждена
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
					
				//Если порльзователь все еще не подтвержден
				}else if(user.emailHasBeenConfirmed==true){
					
					
					
					
					//console.log(loginConfirmationCode);
					
					//console.log(user.loginConfirmationCode==loginConfirmationCode);
					
					
					
					
					
					//Если присланный код подтверждения равен коду подтверждения в базе данных
					if(loginConfirmationCode==user.loginConfirmationCode){
						
						//Если код подтверждения равен коду подтверждения из базы данных,
						//то удаляем код подтверждения
						await user.update({loginConfirmationCode:null});
						
						//Создаем токен
						let token=tokens.createToken({
							
							id:Number(idOfUser),
							
							iat:Date.now(),
							
						});
						
						//Отправляем ответ пользователю с токеном авторизации
						res.send({errorExist:false, actionMessage:'tokenWasCreated', content:{token:token}});
					
					//Если присланный код подтвеждения неправильный
					}else if(loginConfirmationCode!=user.loginConfirmationCode){
							
						//Отправляем ответ пользователю о том, что
						//необходимо перейти на страницу подтверждения email
						res.send({errorExist:true, actionMessage:'invalidLoginConfirmationToken'});
						
					}
				
				}
			
			//Если токен не валдиный, то отправляем об этом ответ
			}else{
				
				res.send({errorExist:true, actionMessage:'invalidConfirmationToken'});
			
			}
		
		}
		
		
	}
	

	async confirmRegistration(req, res){
		
		//Получаем данные из объекта запроса пользователя
		let data=req.body;

		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{
				
				confirmationToken:{ type: 'string'},
				
			},
			
			required: ['confirmationToken'],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			let confirmationToken=data.confirmationToken;
			
			//Проверяем токен подтверждения на валидность
			if(tokens.checkToken(confirmationToken)=='TokenIsValid'){
			//Если токен валидный, то дальше обрабатываем ответ	
			
				//Декодируем токен
				let decodedToken=tokens.getDecodedToken(confirmationToken);

				let idOfUser=decodedToken.id;
				
				let confirmationCode=decodedToken.confirmationCode;
				
				//Находим пользователя в базе данных
				const user=await userModel.findOne({
									
					attributes:['id','emailHasBeenConfirmed','confirmationCode'],
									
					where:{id:idOfUser},
								
				});
				
				if(user==null){
					
					//Если пользователя нет в базе данных, то отправляем сообщение, что пользователь не найден
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
					
				}else if(user.emailHasBeenConfirmed==true){
								
					//Отправляем ответ пользователю о том, что регистрация пользователя уже была подтверждена
					res.send({errorExist:true, actionMessage:'registrationOfUserHasBeenConfirmed'});
					
				//Если порльзователь все еще не подтвержден
				}else if(user.emailHasBeenConfirmed==false){
					
					//Если присланный код подтверждения равен коду подтверждения в базе данных
					if(confirmationCode==user.confirmationCode){
						
						//Если код подтверждения равен коду подтверждения из базы данных,
						//то подтверждаем регистрацию пользователя
						await user.update({emailHasBeenConfirmed:true});
						
						//Отправляем ответ пользователю о том, что
						//регистрация пользователя завершена
						res.send({errorExist:false, actionMessage:'registrationOfUserHasBeenConfirmed'});
					
					//Если присланный код подтвеждения неправильный
					}else if(confirmationCode!=user.confirmationCode){
							
						//Отправляем ответ пользователю о том, что
						//необходимо перейти на страницу подтверждения email
						res.send({errorExist:true, actionMessage:'invalidConfirmationToken'});
						
					}

				}
				
			//Если токен не валдиный, то отправляем об этом ответ
			}else{
				
				res.send({errorExist:true, actionMessage:'invalidConfirmationToken'});
				
			}	

		}
		
	};
	
	async recoverPassword(req, res){
		
		//Получаем данные из объекта запроса пользователя
		let data=req.body;
		
		//Изменяем все буквы в email на строчные
		let email=data.email.toLowerCase();
		
		//Проверяем email на корректность
		//Если email некорректный, то отправляем сообщение об ошибке
		if(emailValidator.validate(email)==false){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:'invalidEmail'});
		
		//Иначе дальше продолжаем работу:
		}else{
			
			//Находим пользователя в базе данных
			const user=await userModel.findOne({
								
				attributes:['id', 'emailHasBeenConfirmed', 'name'],
								
				where:{email:email},
							
			});
			
			//Если пользователь в таким Email не найден, то создаем нового пользователя
			if(user==null){
					
				//Отправляем ответ пользователю о том, что
				//указанный email не зарегистрирован
				res.send({errorExist:true, actionMessage:'userIsNotExist'});
				
			}else{
			//Если пользователь найден, то проверяем зарегистрирован ли его email
				
				//Если email пользователя НЕ был подтвержден, то 
				if(user.emailHasBeenConfirmed==false){
					
					//Отправляем ответ пользователю о том, что
					//указанный email не зарегистрирован
					res.send({errorExist:false, actionMessage:'userIsNotExist'});
					
				//Если email пользователя был подтвержден, то отправляем пользователю сообщение
				//что необходимо использовать другой email
				}else if(user.emailHasBeenConfirmed==true){
					
					let name=user.name;
					
					//Создаем новый код подтвеждения
					let changePasswordConfirmationCode=createConfirmationCode();
					
					//Изменяем код подтверждения пользователя в базе данных
					await user.update({changePasswordConfirmationCode:changePasswordConfirmationCode});
					
					//Создаем токен подтверждения
					let confirmationToken=tokens.createToken({
							
						id:Number(user.id),
						
						changePasswordConfirmationCode:changePasswordConfirmationCode,
							
						iat:Date.now(),
							
					});
					
					let passwordChangeLetter=
					`
					<h1>Смена пароля</h1>
					<h2>Привет, ${name}</h2>
					<p>Для смены пароля перейдите по ссылке ниже:</p>
					<a 
					href=${req.headers.origin}/autorization/createNewPassword?changePasswordConfirmationToken=${confirmationToken}>
					Сменить пароль</a>
					
					`;
					//Отправляем ссылку для смены пароля пользователя на его email
					sendConfirmationCode(email, 'Смена пароля', passwordChangeLetter);

					//Отправляем ответ пользователю о том, что нужно проверить email
					res.send({errorExist:false, actionMessage:'checkEmail'});
					
				}
					
			}
			
		}
		
	};

	async createNewPassword(req, res){

		//Получаем данные из объекта запроса пользователя
		let data=req.body;

		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
			
			type:'object',
			
			properties:{

				newPassword:{ type: 'string', minLength: 8,},
				
				changePasswordConfirmationToken:{ type: 'string'},
				
			},
			
			required: ['newPassword', 'changePasswordConfirmationToken'],

		}
		
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
		
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
			
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
		
		}else{
			
			let newPassword=data.newPassword;
		
			let changePasswordConfirmationToken=data.changePasswordConfirmationToken;
			
			//Проверяем токен подтверждения на валидность
			if(tokens.checkToken(changePasswordConfirmationToken)=='TokenIsValid'){
			//Если токен валидный, то дальше обрабатываем ответ	
			
				//Декодируем токен
				let decodedToken=tokens.getDecodedToken(changePasswordConfirmationToken);

				let idOfUser=decodedToken.id;
				
				let changePasswordConfirmationCode=decodedToken.changePasswordConfirmationCode;
				
				//Находим пользователя в базе данных
				const user=await userModel.findOne({
									
					attributes:['id','emailHasBeenConfirmed','changePasswordConfirmationCode'],
									
					where:{id:idOfUser},
								
				});			
	
				//Если пользователь в таким Email не найден, то создаем нового пользователя
				if(user==null){
							
					//Отправляем ответ пользователю о том, что
					//указанный email не зарегистрирован
					res.send({errorExist:true, actionMessage:'userIsNotExist'});
						
				}else{
					//Если пользователь найден, то проверяем зарегистрирован ли его email
						
					//Если email пользователя НЕ был подтвержден, то 
					if(user.emailHasBeenConfirmed==false){
							
						//Отправляем ответ пользователю о том, что
						//указанный email не зарегистрирован
						res.send({errorExist:true, actionMessage:'userIsNotExist'});
							
						//Если email пользователя был подтвержден, то отправляем пользователю сообщение
						//что необходимо использовать другой email
						
					}else if(user.emailHasBeenConfirmed==true){
							
						//Если код подтверждения смены пароля равен коду подтверждения в базе данных
						//то меняем пароль в базе данных
						if(changePasswordConfirmationCode==user.changePasswordConfirmationCode){

							//Изменяем код подтверждения пользователя в базе данных
							await user.update({password:newPassword, changePasswordConfirmationCode:null});
					
							//Отправляем ответ пользователю о том, что нужно проверить email
							res.send({errorExist:false, actionMessage:'passwordWasUpdated'});	

						//Иначе сообщаем пользователю, что код подтверждения неверный	
						}else if(changePasswordConfirmationCode!=user.changePasswordConfirmationCode){
								
							//Отправляем ответ пользователю о том, что нужно проверить email
							res.send({errorExist:true, actionMessage:'invalidConfirmationCode'});
								
						}
								
					}
							
				}
				
			}

		}
		
	};
	
	
	async getTelegramAuthorizationToken(req, res){

		//Получаем токен из объекта запроса пользователя
		let token=req.token;
			
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
		
		//Получаем данные из токена
		let id=decodedToken.id;

		//Находим пользователя в базе данных
		const user=await userModel.findOne({
									
			attributes:['id', 'name', 'email'],
									
			where:{id:id},
								
		});
		
		let name=user.name;
		
		let email=user.email;
		
		//Создаем токен подтверждения
		let TelegramAuthorizationToken=tokens.createToken({
									
			id:Number(id),
			
			TelegramAuthorizationToken:true,
								
			iat:Date.now(),
									
		});
							
		let TelegramAuthorizationTokenLetter=
		`
		
			<h1>Токен авторизации в телеграмм-боте</h1>
			<h2>Привет, ${name}</h2>
			<p>Для авторизации в телеграмм-боте используй токен, который представлен ниже:</p>
			<span>${TelegramAuthorizationToken}</span>
			<p>Телеграм-бот доступен по ссылке ниже:</p>
			<span>${process.env.telegramBotLink}</span>
		
		`
		
		//Отправляем токен для авторизации в Телеграмм-боте
		await sendConfirmationCode(

			email,

			'Токен авторизации в телеграмм боте', 

			TelegramAuthorizationTokenLetter

		);
		
		//Отправляем ответ пользователю о том, что нужно проверить email
		res.send({
			
			errorExist:false,
			
			actionMessage:'TelegramAuthorizationTokenWasSent'
		
		
		});
		
	};
	
	async getMainData(req, res){

		//Получаем токен из объекта запроса пользователя
		let token=req.token;
			
		//Получаем декодированный токен пользователя
		let decodedToken=tokens.getDecodedToken(token);
		
		//Получаем данные из токена
		let id=decodedToken.id;

		//Находим пользователя в базе данных
		const user=await userModel.findOne({
									
			attributes:['id','name',],
									
			where:{id:id},
								
		});
		
		let formattedUserObject={
													
			name:user.name,
							
		};
		
		res.send({
			
			errorExist:false, 
			
			actionMessage:'mainDataWasGetted', 
			
			content:{
				
				mainDataOfUser:formattedUserObject
				
			}
			
		});
		
	};
		
	async updateMainData(req, res){

		//Получаем данные из объекта запроса пользователя
		let data=req.body;

		//Определяем ожидаемую схему для проверки объекта данных запроса
		const schema = {
				
			type:'object',
				
			properties:{

				name:{ type: 'string' },
					
			},
				
			required: ['name',],

		};
			
		//Проверям данные в запросе
		const valid=ajv.validate(schema, data);
			
		//Если есть ошибка в данных, то отправляем запрос об этом
		if(!valid){
				
			//Отправляем ответ пользователю о том, что email некорректный
			res.send({errorExist:true, actionMessage:ajv.errors});
			
		}else{

			//Получаем токен из объекта запроса пользователя
			let token=req.token;
			
			//Получаем декодированный токен пользователя
			let decodedToken=tokens.getDecodedToken(token);
			
			//Получаем данные из токена
			let id=decodedToken.id;
			
			//Получаем объект пользователя (если пользователя нет, то получаем пустой ответ)
			const user=await userModel.findOne({where:{id:id}});

			//Изменяем данные о пользователе
			await user.update({

				name:data.name,

			});

			res.send({errorExist:false, actionMessage:'mainDataOfUserWasUpdated'});

		}
		
	};
	
}

module.exports = new UserController();


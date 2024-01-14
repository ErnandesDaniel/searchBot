
//Подключаем функции для работы с DOM
const {
	
	axios,
	
	JSDOM,
	
	getAllHTMLElements,

}=require('./HTML_Parsing_Functions.js');


//Подключаем файл функции обработки запросов
const getDataFromHTMLObjectOfFunPayProduct = require('./getDataFromHTMLObjectOfFunPayProduct.js');

//Подключаем файл функции отправки ботом сообщений в телеграмм
const sendMessage = require('../../TelegramBot/sendMessage.js');

//Подключаем модель для создания объекта
const { FunPay_ObjectModel } = require('../../models/models');

//Функция для стандартизации строки
function standardizeString(string){
	
	//Запрещаем использовать множественне пробелы (больше одного)
	string=string.replace(/\s+/g, ' ');
	
	//Если у нас идет первым пробел, то мы его удаляем
	if(string[0]==' ')string=string.slice(1);

	//Уменьшаем все буквы в строке до строчных
	string = string.toLowerCase();

	return string;
	
}


async function processRequest(request){
		
	//Получаем массив sequlize-объектов продуктов данного запроса
	let objectsArray=await request.getFunPay_Objects({
		
		attributes:['idOnSite'],
		
	});
	
	
	//Делаем из него массив объектов (продуктов) лишь с id объекта - чтобы убедится в существовании объекта
	objectsArray=objectsArray.map((object)=>{
		
		return {
			
			idOnSite:object.idOnSite,
			
		}
		
	});
	
	//Получаем массив sequlize-объектов ключевых слов запроса
	let keyWordsArray=await request.getFunPay_KeywordsInObjectDescriptions({
		
		attributes:['Keywords'],
		
	});
	
	//Делаем из него массив ключевых слов
	keyWordsArray=keyWordsArray.map((object)=>{
		
		return standardizeString(object.Keywords);
		
	});
	
	
	//Оборачиваем в try, чтобы в случае ошибки программа не останавливалась
	try{
	
		//Получаем весь HTML-контент на странице
		let html_data=await axios.get(request.href);
		
		//Получаем весь HTML-контент на странице в виде строки
		let searchPageContent=html_data.data;
		
		//Переносим HTML строку в JSDOM
		const searchPageDOM = new JSDOM(searchPageContent);
		
		//Получаем объект документа со всеми DOM моделями
		let document=searchPageDOM.window.document;
		
		//Получаем коллекцию узлов объектов (продуктов, лотов) на странице на данный момент
		let product_HTML_ElementsNodeList=getAllHTMLElements(document,`.tc-item`);
		
		//Получаем из коллекции узлов массив (продуктов, лотов) на странице на данный момент
		let product_HTML_ElementsArray=Array.from(product_HTML_ElementsNodeList);
		
		//Создаем массив с данными для продуков 
		let productsArray=[];
		
		//На основе массива HTML-объектов заполняем массив с данными для продуктов
		product_HTML_ElementsArray.forEach((product_HTML_Element)=>{
			
			//Получаем данные из HTML-объекта
			let {productId, productDescription, productPrice}=getDataFromHTMLObjectOfFunPayProduct(product_HTML_Element);
			
			//Изначально объект считается валидным
			let productIsValid=true;
			
			//Проверяем наличие в базе данных
			//Для этого ищем id в массиве из базы данных, получая индекс элемента
			let indexOfProductInDataBase=objectsArray.findIndex((el)=>el.idOnSite==productId);
			
			//Если индекс в массиве больше минус одного, то объект существует в базе данных
			//И он невалиден для добавления в базу данных
			if(indexOfProductInDataBase>-1){
				
				productIsValid=false;
				
			}
			
			//Если объект не найден в базе данных, то проверяем его цену
			if(productIsValid==true){
				
				//Если цена продукта больше максимальной цены объекта, то объект невалидный
				if(productPrice>request.maximumObjectPrice){
					
					productIsValid=false;
					
				}
				
			}
			
			//Если объект не найден в базе данных и его цена соответствует требованиям,то
			//проверяем наличие всех ключевых слов в описании объекта, 
			//если хотя бы одного из них нет, то объект не будет добавлен в базу данных
			if(productIsValid==true){
				
				keyWordsArray.forEach((keyWord)=>{
					
					//Проверяем валиден ли объект, если он уже невалиден, то нет смысла в дальнейшей проверке
					if(productIsValid==true){
					
						//Если ключевое слово в описании товара не найдено, то товар считается невалидным
						if(standardizeString(productDescription).includes(keyWord)==false){
							
							productIsValid=false;
							
						}
						
					}
						
				});
				
			}
			
			//Если данные объекта после проверки оказались валидными
			if(productIsValid==true){
				
				//То добавляем этот объект в массив для записи в базу данных
				productsArray.push({
							
					idOnSite:productId, 
					
					description:productDescription,
					
					price:productPrice,
					
					FunPayRequestId:request.id,
					
				})
				
				
			}
			
		});
		
		console.log('FunPay длина массива: '+productsArray.length);
		
		//Если массив продуктов имеет хотя бы один элемент для добавления	
		if (productsArray.length>0){
			
			//Добавляем в базу данных список новых объявлений
			await FunPay_ObjectModel.bulkCreate(productsArray);
			
			//Пишем пользовтелю в ТГ, что были добавлены новые объекты в базу данных:
			//Получаем общее количество найденных подходящих объявлений
			let objectsAmount=productsArray.length;
			
			//Получаем объект пользователя
			let user=await request.getUser();
			
			//Получаем связанные с ним чаты с ТГ ботом
			let telegramChatsArray=await user.getTelegramChats();
			
			//Посылаем во все ТГ чаты этого пользователя с ботом, что в базу данных 
			//были добавлены новые записи с товарами с данного сайта
			for(telegramChat of telegramChatsArray){
				
				//Если данный чат авторизован у данного пользователя, 
				if(telegramChat.authorizationStatus==true){
					
					//То отправляем в этот чат сообщение о новых объявлениях
					await sendMessage(telegramChat.idOfChat, 'FunPay', objectsAmount);
				
				}
				
			}
			
		}
		
	}catch (error) {
		
		console.log(error);
		
	}
		
}

//Экспортируем объект маршрутизации
module.exports= processRequest;
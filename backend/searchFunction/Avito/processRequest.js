
//Подключаем функции для работы с DOM
const {
	
	JSDOM,
	
	getHTMLElement,
	
	getTextFromHTMLElement,
	
	getAllHTMLElements,

}=require('./HTML_Parsing_Functions.js');

//Подключаем файл функции обработки запросов
const getDataFromHTMLObjectOfAvitoProduct = require('./getDataFromHTMLObjectOfAvitoProduct.js');

//Подключаем файл функции отправки ботом сообщений в телеграмм
const sendMessage = require('../../TelegramBot/sendMessage.js');

//Подключаем модель для создания объекта
const { Avito_ObjectModel } = require('../../models/models');


function getRandomInt(max){
	
  return Math.floor(Math.random() * max);
  
}


async function processRequest(request, browser){
	
	//Получаем массив sequlize-объектов продуктов данного запроса
	let objectsArray=await request.getAvito_Objects({
		
		attributes:['linkOnSite'],
		
	});
	
	//Делаем из него массив объектов (продуктов) лишь с id объекта - чтобы убедится в существовании объекта
	objectsArray=objectsArray.map((object)=>{
		
		return {
			
			linkOnSite:object.linkOnSite,
			
		}
		
	});
	
	
	async function getDOMFromURL(page){
		
		//Создаем переменную для хранения объекта с данными HTML-страницы
		let document=null;
			
		//Получаем номер случайного порта proxy
		//От 9060 до 9100
		let port=9060+getRandomInt(40);
		
		//Пытаемся получить HTML-код страницы
		try{
			
			//Создаем новый контекст браузера со случайным значением порта подключения
			let context = await browser.newContext({args: [`--proxy-server=socks5://127.0.0.1:${port}`],});
			
			//Создаем новую страницу в контексте
			let searchPage = await context.newPage();
			
			//Получаем текст необходимого запроса
			let requestText=request.requestText;
			
			//Создаем базовое URL для запроса
			let baseURL='https://www.avito.ru/';
				
			//Настраиваем URL для поиска: добавляем текст и сортировку по дате:&s=104
			let searchURL=`${baseURL}all?p=${page}&q=${requestText}&s=104`;
				
			//Если есть ссылка на категорию, то она позволит уменьшить количество анализируемой продукции
			if(request.linkWithData!=''){
				
				baseURL=request.linkWithData;
					
				//Сортировка по дате:&s=104
				searchURL=`${baseURL}&p=${page}&s=104`;		
					
			}
			
			//Переходим на страницу поиска
			await searchPage.goto(searchURL,{waitUntil:'domcontentloaded'});
			
			//Получаем весь HTML-контент на странице
			let searchPageContent=await searchPage.content();
			
			//Переносим HTML строку в JSDOM
			const searchPageDOM=new JSDOM(searchPageContent);
					
			//Получаем объект документа со всеми DOM моделями и записываем его
			//в соответствующую переменную
			document=searchPageDOM.window.document;
			
			//Закрываем контекст
			await context.close();
			
		}catch(error) {
		
			console.log('Страница не была загружена');
		
		}finally{
			
			return document;	
			
		}
			
	}
		
	//Оборачиваем в try, чтобы в случае ошибки программа не останавливалась
	try{
		
		let document=await getDOMFromURL(1);
		
		if(document!=null){
			
			//Получаем HTML элемент страницы с номером последней страницы
			let lastPageNumber_HTML_Element=getHTMLElement(document, '.styles-module-listItem_last-GI_us>a>span');
			
			//Изначально номер последней страницы равен 1
			let lastPageNumber=1;
			
			//Если найден элемент с номером последней страницы, то получаем его
			if(lastPageNumber_HTML_Element!=null){
				
				//Получаем номер последней страницы как число
				lastPageNumber=Number(getTextFromHTMLElement(lastPageNumber_HTML_Element));
				
			}
			
			//Изначально поиск информации не является завершенным
			let searchIsCompleted=false;
			
			//Переменная содержит максимальное число дней, насколько ранее товар был выложен ранее,
			//чем сегодняшнее число, чтобы товар был валидный
			let differenceFromCurrentDay=request.differenceFromCurrentDay;
			
			//Число этих дней дожлено быть как нимимум равно 1
			if(differenceFromCurrentDay<1){
							
				differenceFromCurrentDay=1;
							
			}
			
		
			//Функция для анализа и записи данных в базу данных
			async function recordingData(document){

				//Получаем коллекцию узлов-объектов (продуктов, лотов) на странице на данный момент
				let product_HTML_ElementsNodeList=getAllHTMLElements(document,`.items-items-kAJAg>div`);
						
				//Получаем из коллекции узлов массив (продуктов, лотов) на странице на данный момент
				let product_HTML_ElementsArray=Array.from(product_HTML_ElementsNodeList);
				
				//Создаем массив с данными для продуков
				let productsArray=[];
				
				//На основе массива HTML-объектов заполняем массив с данными для продуктов
				product_HTML_ElementsArray.forEach((product_HTML_Element)=>{
					
					//Получаем данные из HTML-объекта
					let {
						
						productId,
					
						productDescription,
					
						productCreationTime,
					
						productPrice,
						
						productName,
					
					}=getDataFromHTMLObjectOfAvitoProduct(product_HTML_Element);
					
					//Изначально объект считается валидным
					let productIsValid=true;
					
					//Проверяем наличие в базе данных
					//Для этого ищем id в массиве из базы данных, получая индекс элемента
					let indexOfProductInDataBase=objectsArray.findIndex((el)=>el.linkOnSite==productId);
					
					//Если индекс в массиве больше минус одного, то объект существует в базе данных
					//И он невалиден для добавления в базу данных
					if(indexOfProductInDataBase>-1){
						
						productIsValid=false;
						
					}

					//Если объект не найден в базе данных, то проверяем валидность его даты
					if(productIsValid==true){
						
						//Получаем дату равную сегодня минус указанное количество дней в формате Unix
						//Это последняя валидная дата
						
						let lowerValidDateInUnix=new Date().setDate(new Date().getDate()-differenceFromCurrentDay);
						
						//Получаем время создания продукта в формате Unix
						let productCreationTimeInUnix=Date.parse(productCreationTime);
						
						//Если время создания продукта (выкладывания объявления) больше самого последнего времени
						//для объявления, то продукт невалидный
						if(productCreationTimeInUnix<lowerValidDateInUnix){
							
							productIsValid=false;
							
							//Так как поиск товаров осуществляется от меньшей даты к большей, то если найденный товар
							//имеет дату меньшую самой нижней возможной, то это значит, что дальше все товары будут иметь
							//тоже дату меньше необходимой и поиск может быть завершен
							searchIsCompleted=true;
							
						}	
						
					}
					
					//Если объект не найден в базе данных, то проверяем его цену
					if(productIsValid==true){
						
						//Если цена продукта больше максимальной цены объекта, то объект невалидный
						if(productPrice>request.maximumObjectPrice){
							
							productIsValid=false;
							
						}
						
						//Если цена продукта меньше минимальной цены объекта, то объект невалидный
						if(productPrice<request.minimumObjectPrice){
							
							productIsValid=false;
							
						}
						
					}
								
					//Если данные объекта после проверки оказались валидными
					if(productIsValid==true){
						
						//То добавляем этот объект в массив для записи в базу данных
						productsArray.push({
									
							linkOnSite:productId, 
							
							description:productDescription,
							
							name:productName,
							
							price:productPrice,
							
							creationTime:productCreationTime,
							
							AvitoRequestId:request.id,
							
						})
						
					}
					
				});
				
				console.log('Авито длина массива: '+productsArray.length);
				
				//Если массив продуктов имеет хотя бы один элемент для добавления	
				if (productsArray.length>0){
					
					//Добавляем в базу данных список новых объявлений
					await Avito_ObjectModel.bulkCreate(productsArray);
					
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
							await sendMessage(telegramChat.idOfChat, 'Avito', objectsAmount);
						
						}
						
					}
					
				}	
				
			}			
		
			
			//Если страниц больше 1, то анализируем их все
			if(lastPageNumber>1){
				
				//Получение и запись данных из текущего объекта документа
				await recordingData(document);
				
				//Переходим по всем страницам до полученного максимального числа
				for(let i=2; i<=lastPageNumber && searchIsCompleted==false; i++){
				
					//Получение объекта документа страницы сайта
					let document=await getDOMFromURL(i);	
					
					//Получение и запись данных из объекта документа	
					await recordingData(document);
				
				}	
				
			}else{
				
				//Получение и запись данных из объекта документа
				await recordingData(document);
				
			}
			
			
		}
		
	}catch(error){
		
		console.log(error);
		
	}
		
}

//Экспортируем объект маршрутизации
module.exports= processRequest;
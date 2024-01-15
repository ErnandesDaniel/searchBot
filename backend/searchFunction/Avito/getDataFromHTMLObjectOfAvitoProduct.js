
//Подключаем функции для работы с DOM
const {
	
	getTextFromHTMLElement,

	getAttributeFromHTMLElement,
	
	getHTMLElement,

}=require('./HTML_Parsing_Functions.js');

const chrono = require('chrono-node');

function getDataFromHTMLObjectOfAvitoProduct(product_HTML_Element){

	//Получаем ссылку как HTML-объект, которая позволяет перейти на страницу объекта
	let link_HTMLElement=getHTMLElement(product_HTML_Element, 'div.iva-item-body-KLUuy>div.iva-item-titleStep-pdebR>div>a');
		
	//Получаем ссылку, на которую указывает продукт
	let hrefAttribute=getAttributeFromHTMLElement(link_HTMLElement, 'href');

	//Получаем id продукта из его URL
	let productId=hrefAttribute;
	
	//Получаем цену продукта как HTML-элемент
	let productPrice_HTML_Element=getHTMLElement(product_HTML_Element, 'div.iva-item-body-KLUuy > div.iva-item-priceStep-uq2CQ .styles-module-root-LIAav> span');
	
	//Получаем строку с ценой продукта
	let productPrice=getTextFromHTMLElement(productPrice_HTML_Element);

	//Убираем из строки все символы кроме цифр
	productPrice=productPrice.replace(/\D/g,'');

	//Получаем цену продукта как число
	productPrice=Number(productPrice);
	
	//Получаем описание продукта
	let productDescription_HTML_Element=getHTMLElement(product_HTML_Element, '.iva-item-body-KLUuy > div.iva-item-descriptionStep-C0ty1 > p	');
	
	let productDescription='';
	
	if(productDescription_HTML_Element!=null){
		
		//Получаем описание продукта как строку
		productDescription=getTextFromHTMLElement(productDescription_HTML_Element);
		
	}
	
	
	//Получаем название продукта
	let productName_HTML_Element=getHTMLElement(product_HTML_Element, '.iva-item-body-KLUuy > div.iva-item-titleStep-pdebR > div > a > h3');
	
	//Получаем название продукта как строку
	let productName=getTextFromHTMLElement(productName_HTML_Element);
	
	//Получаем HTML-элемент времени создания объявления
	let productCreationTime_HTML_Element=getHTMLElement(product_HTML_Element, '.iva-item-body-KLUuy > div.iva-item-dateInfoStep-_acjp p');

	//Получаем время создания объявления как строку
	let productCreationTime=getTextFromHTMLElement(productCreationTime_HTML_Element);
	
	//Получаем время создания объявления в формате даты ISO
	productCreationTime=chrono.ru.parseDate(productCreationTime);
	
	return {
		
		productId,
		
		productDescription,
	
		productPrice,
		
		productCreationTime,
		
		productName,
	
	};

}

//Экспортируем объект маршрутизации
module.exports= getDataFromHTMLObjectOfAvitoProduct;

//Подключаем функции для работы с DOM
const {
	
	getTextFromHTMLElement,

	getAttributeFromHTMLElement,
	
	getHTMLElement,

}=require('./HTML_Parsing_Functions.js');



function getDataFromHTMLObjectOfFunPayProduct(product_HTML_Element){
	
	//Получаем ссылку, на которую указываем продукт
	let hrefAttribute=getAttributeFromHTMLElement(product_HTML_Element, 'href');
	
	//Разбираем ссылку (URL-объект) 
	let productURL=new URL(hrefAttribute);
	
	//Получаем id продукта из его URL
	let productId=productURL.searchParams.get('id');
		
	//Получаем цену продукта
	let productPrice_HTML_Element=getHTMLElement(product_HTML_Element, 'div.tc-price > div:nth-child(1)');
		
	//Получаем валюту цены продукта
	let productPriceCurrency_HTML_Element=getHTMLElement(productPrice_HTML_Element,'span');
		
	//Удаляем блок с валютой цены продукта
	productPrice_HTML_Element.removeChild(productPriceCurrency_HTML_Element);
		
	//Получаем цену продукта как строку
	let productPrice=getTextFromHTMLElement(productPrice_HTML_Element);
	
	//Удаляем лишние пробелы в строке с числом, если они есть
	productPrice=productPrice.replace(/\s/g,'');
	
	//Получаем цену продукта как число
	productPrice=Number(productPrice);
	
	//Получаем описание продукта
	let productDescription_HTML_Element=getHTMLElement(product_HTML_Element, 'div.tc-desc > div.tc-desc-text');
		
	//Получаем описание продукта как строку
	let productDescription=getTextFromHTMLElement(productDescription_HTML_Element);
		
	return {productId, productDescription, productPrice};

}


//Экспортируем объект маршрутизации
module.exports= getDataFromHTMLObjectOfFunPayProduct;
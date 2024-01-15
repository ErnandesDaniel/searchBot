
const { chromium }=require('playwright');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;


function getTextFromHTMLElement(DOM_Object){
	
	let text=DOM_Object.textContent;
	
	//Удаляем символы переноса строки
	text = text.replace(/(\r\n|\n|\r)/gm, "");
	
	//Удаляем лишние пробелы в строке (более одного пробела подряд)
	text = text.replace(/ +/g, ' ');
	
	return text;
	
}


function getAttributeFromHTMLElement(DOM_Object, attributeName){
	
	return  DOM_Object.getAttribute(attributeName);
	
}


function getHTMLElement(DOM_Object, selector){
	
	return DOM_Object.querySelector(selector);
	
}


function getAllHTMLElements(DOM_Object, selector){
	
	return DOM_Object.querySelectorAll(selector);
	
}


async function testGettingDataFromPage(){

const searchURL='https://www.avito.ru/sankt-peterburg?q=%D1%84%D0%B0%D1%80%D1%84%D0%BE%D1%80';

	//Запуск браузера
	const browser = await chromium.launch({headless:false,});
				
	//Откроем страницу
	const searchPage = await browser.newPage();
				
	//Переходим на страницу поиска
	await searchPage.goto(searchURL,{waitUntil:'domcontentloaded'});
				
	//Получаем весь HTML-контент на странице
	let searchPageContent=await searchPage.content();
	
	//Переносим HTML строку в JSDOM
	const searchPageDOM=new JSDOM(searchPageContent);
					
	//Получаем объект документа со всеми DOM моделями
	let document=searchPageDOM.window.document;
			
	//await browser.close();	
	
	//Получаем коллекцию узлов объектов (продуктов, лотов) на странице на данный момент
	let product_HTML_ElementsNodeList=getAllHTMLElements(document,`.items-items-kAJAg>div`);
						
	//Получаем из коллекции узлов массив (продуктов, лотов) на странице на данный момент
	let product_HTML_ElementsArray=Array.from(product_HTML_ElementsNodeList);
				
	//Создаем массив с данными для продуков
	let productsArray=[];
				
	let product_HTML_Element=product_HTML_ElementsArray[0];

	//Получаем ссылку как HTML-объект, которая позволяет перейти на страницу объекта
	let link_HTMLElement=getHTMLElement(product_HTML_Element, 'div.iva-item-body-KLUuy>div.iva-item-titleStep-pdebR>div>a');	
	
	//Получаем ссылку, на которую указывает продукт
	let hrefAttribute=getAttributeFromHTMLElement(link_HTMLElement, 'href');
	
	//Получаем цену продукта как HTML-элемент
	let productPrice_HTML_Element=getHTMLElement(product_HTML_Element, 'div.iva-item-body-KLUuy > div.iva-item-priceStep-uq2CQ .styles-module-root-LIAav> span');
	
	//Получаем строку с ценой продукта
	let productPrice=getTextFromHTMLElement(productPrice_HTML_Element);

	//Убираем из строки все символы кроме цифр
	productPrice=productPrice.replace(/\D/g,'');

	//Получаем цену продукта как число
	productPrice=Number(productPrice);
	
	console.log(hrefAttribute);	
	
	console.log(productPrice);	
		
};


testGettingDataFromPage();






















const axios=require('axios');

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


//Экспортируем объект маршрутизации
module.exports= {
	
	axios,
	
	JSDOM,
	
	getTextFromHTMLElement,

	getAttributeFromHTMLElement,
	
	getHTMLElement,
	
	getAllHTMLElements,

};






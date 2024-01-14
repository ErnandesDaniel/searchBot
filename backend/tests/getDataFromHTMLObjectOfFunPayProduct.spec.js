
const getDataFromHTMLObjectOfFunPayProduct=require('../searchFunction/FunPay/getDataFromHTMLObjectOfFunPayProduct.js');

//Подключаем функции для работы с DOM
const {
	
	axios,
	
	JSDOM,
	
	getAllHTMLElements,

}=require('../searchFunction/FunPay/HTML_Parsing_Functions.js');


async function testGettingDataFromPage(numberLot){

	let html_data=await axios.get(`https://funpay.com/lots/${numberLot}/`);
		
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
	
	product_HTML_ElementsArray.forEach((product_HTML_Element)=>{	
		
	i=0;
	
	//Получаем данные из HTML-объекта
	let {productId, productDescription, productPrice}=getDataFromHTMLObjectOfFunPayProduct(product_HTML_Element);
	
		if(productPrice>10000){

			console.log(productPrice);
		
		}
	
	});
	
};

/*
for(let i=0; i<=10; i++){
	
	testGettingDataFromPage(80+i);	
	
}
*/

	testGettingDataFromPage(83);





















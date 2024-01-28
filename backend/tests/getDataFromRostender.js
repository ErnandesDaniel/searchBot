
const axios=require('axios');

const fs = require("fs");


//const { chromium }=require('playwright');

//const { SocksProxyAgent } = require('socks-proxy-agent');

//const torProxyAgent = new SocksProxyAgent("socks://127.0.0.1:9052");

//function getHTMLContent(config){
	
	//config.mode=='axios'
	
	//config.mode=='browser'
	
	
	
	//config.url,
	
	//config.proxy!=null
	
	//config.proxy.host
	
	//config.proxy.port
	
//}


async function testProxy(){	
	
/*
	
	const searchURL=`http://api.ipify.org/`;
	
	//Запуск браузера
	browser = await chromium.launch({
		
		headless:false,
	
		 args: ['--proxy-server=socks5://127.0.0.1:9060'],
		
	});
		
	//Откроем страницу
	searchPage = await browser.newPage();
	
	//Переходим на страницу поиска
	await searchPage.goto(searchURL,{waitUntil:'domcontentloaded'});
	
*/
	
	
	//Получение данных по ссылке и запись в файл
	/*
	
	const response = await axios.request({
		
		
		url: 'https://rostender.info/extsearch',
		
		method: 'GET',
		
		//httpsAgent: torProxyAgent,
	});
	
	console.log(response.data);
	
	//синхронное добавление
	fs.appendFileSync("rostender.html", response.data);	
	*/
	
	
	//Получаем данные с сайта Тендеров
	const response = await axios({
		
		
		url: 'https://rostender.info/search/tenders',
		
		method: 'POST',
		
		data:{
		
			//Нужен для того, чтобы поиск работал
			path: '/extsearch',
			
			//Нужен для упрощенного формата поиска
			mode: 'simple',
			
			//Нужны для совпадения с браузером
			default_search: '0',
			
			//Нужны для совпадения с браузером
			open_data: '1',
			
			//Нужны для совпадения с браузером
			fingerprint: '630d376558911e3dac3a602237d534d1',
			
			//Само ключевое слово поиска
			keywords: 'Химия',
				
        },
		
        headers: {
			
			//Данный заголовок необходим, чтобы результат совпадал с браузером
			'Content-Type':'application/x-www-form-urlencoded',
			
        }
		

	});
	
	
	
	//console.log(response.responseUrl);
	//console.log(response.path);
    //console.log(response.data);

    console.log(response.request.path);
	
	//fs.appendFileSync("rostender.html", response.data);	
	//console.log(response.response.headers.location);
	
}

testProxy();


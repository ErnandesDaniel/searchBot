
//const axios=require('axios');

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
	

	/*
	
	const response = await axios.request({
		url: 'https://httpbin.org/ip',
		method: 'GET',
		httpsAgent: torProxyAgent,
	});
	
	console.log(response.data);
	
	*/
		
		
		/*
		
		const response = await axios.request({
			
			
			url: 'https://www.avito.ru/sankt-peterburg?q=%D1%84%D0%B0%D1%80%D1%84%D0%BE%D1%80',
			
			method: 'GET',
			
			
			
			
			httpsAgent: torProxyAgent,
			
		});
		
		
		*/
	
}

testProxy();


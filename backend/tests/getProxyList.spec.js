

const { getProxyList }=require('../utils/getProxyList.js');

const axios=require('axios');


async function test(){
	
	let proxyList=await getProxyList();
	
	//console.log(proxyList[0]);
	
	
	
	
	let config={
		
		method:'get',

		url:'https://httpbin.org/ip',

		proxy: {
			
			host: '188.166.30.17',
			
			port: 8888,

		},

	};
	
	
	
	
	//let response = await axios.get('https://httpbin.org/ip');
	
	let response = await axios({
		
		method: 'get', 
		
		url: 'https://httpbin.org/ip',
		
		 proxy: {
			
			host: '41.242.69.196',
			
			port: 5678,
			
			
			
			//auth: {
			 // username: 'mikeymike',
			 // password: 'rapunz3l'
			//},
			
			
			
			
		  },
		
		
		
		
		
		
		
		
		
		
		});
	
	
	
	
	
	
	
	
	let ipAddress = response.data.origin;

	//Log or use the IP address
	console.log('Ваш IP адрес: '+ipAddress);
	

	
}



test();







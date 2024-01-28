
const axios=require('axios');

async function getProxyList(){
	
	let proxyList=[];
	
	try{
	
		proxyList=(await axios.get('https://advanced.name/freeproxy/65ac22d26d1e3')).data;
		
		//Используем метод split с указанием разделителя
		proxyList = proxyList.split('\r\n'); 
		
		proxyList=proxyList.map((el)=>{
			
			let data=el.split(':');
			let ip=data[0];
			let port=data[1];
			
			return {ip, port};
			
		});
		
	
	}catch(error){
		
		console.log(error);
		
		
	}

	return proxyList;
	
}



//Экспортируем функцию для получения списка прокси
module.exports={
	
	getProxyList,
	
	
};










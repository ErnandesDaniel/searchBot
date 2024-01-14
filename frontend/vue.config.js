
//Указываем директорию для расположения файла кофигурации .env
const dotenv = require("dotenv");

//Указываем где находится файл с переменными среды
dotenv.config({path: '../backend/.env'});

const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
	
	transpileDependencies: true,
  
	pwa: {
		
		name: 'HSTE Job',
		
		themeColor: 'white',
		
		msTileColor: 'white',

		//настройки манифеста
		manifestOptions:{
			
			background_color: 'white',
			
			//другие настройки манифеста
			
		},
		
	},
	
	//Проксируем в режиме разработки все HTTP-запросы на запущенный сервер разработки
	devServer:{
		
		proxy:{
					
			'/api':{
				
				//Указывает проксирование HTTP-запросов к API во время разработки
				target: 'http://localhost:'+process.env.VUE_APP_PORT,
				
			},
			
		},
	
	},	
  
})














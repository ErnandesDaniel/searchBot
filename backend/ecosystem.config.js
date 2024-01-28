module.exports = {

	apps:[{
	  
		name:'searchBot',
			
		script:'./app.js',

		watch:true,
		
		watch_delay:3000, 
		
		ignore_watch:[ 
          './node_modules',
          './package.json',
		  './package-lock.json',
         ],

		out_file: "./out.log",
		
		error_file: "./error.log",	
		
		log_date_format: "DD-MM HH:mm:ss Z",
		
		log_type: "json",
		
		merge_logs:true ,
		
		//Перезапуск приложения при достижении им определенного потребления памяти
		max_memory_restart: '2000M',
		
		//Перерзапуск приложения каждую 30-ую минуту часа
		
		// /:косая черта используется для определения интервала шага. 
		//Например, */30 * * * *определяет задание, которое будет повторяться каждые 30 минут.
		
		cron_restart: '*/30 * * * *',
	
	}]
  
}

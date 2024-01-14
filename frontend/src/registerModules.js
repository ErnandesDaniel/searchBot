import router from "./router";

export const registerModules=(arrayOfModules)=>{
	
	//Для каждого элемента массива - модуля запускаем функцию добавления
	//путей
	arrayOfModules.forEach((module) => {
		
		if(module.routes!=null){

			//Для каждого модуля запускаем функцию добавления пути
			//(так как в модуле есть массив путей)
			module.routes.forEach((route) => {

				router.addRoute(route);

			});
			
		}
	
  });
  
};

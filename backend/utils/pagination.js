

const getPagination = (page, size)=>{
	
	const limit = size ? +size : 10;
	
	const offset = page ? page * limit : 0;
	
	return { limit, offset };
	
};


const getPagingData = (totalObjects, page, limit)=>{
	
	const currentPage=page?+page:0;
	
	const totalPages=Math.ceil(totalObjects/limit);
		
	return {totalPages, currentPage};
	
};


//Экспортируем объект с функциями для работы с пагинацией
module.exports={
	
	getPagination,
	
	getPagingData,
	
};










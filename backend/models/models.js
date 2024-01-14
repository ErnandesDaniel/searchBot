const sequelize = require('../database')
const {DataTypes} = require('sequelize')

const userModel = sequelize.define('users',{
	
	email:{type: DataTypes.STRING, unique: true,},
	
	password:{type: DataTypes.STRING},
	
	confirmationCode:{type: DataTypes.STRING},
	
	emailHasBeenConfirmed:{type: DataTypes.BOOLEAN},
	
	name:{type: DataTypes.STRING},
	
	loginConfirmationCode:{type: DataTypes.STRING},
	
});

const TelegramChatsModel = sequelize.define('telegramChats',{
	
	idOfChat:{type: DataTypes.INTEGER},
	
	authorizationStatus:{type: DataTypes.BOOLEAN},
	
});


//--------------------------------------------------------------------------------------

const FunPay_RequestModel = sequelize.define('FunPay_Requests',{
	
	description:{type: DataTypes.TEXT},//Описание запроса
	
	href:{type: DataTypes.TEXT},//Ссылка на саму HTML-страницу с товарами
	
	maximumObjectPrice:{type: DataTypes.DOUBLE},//Максимальная цена объекта
	
});


const FunPay_KeywordsInObjectDescriptionModel = sequelize.define('FunPay_KeywordsInObjectDescriptions',{
	
	Keywords:{type: DataTypes.TEXT},//Ключевые слова для поиска
	
});


const FunPay_ObjectModel = sequelize.define('FunPay_Objects',{
	
	idOnSite:{type: DataTypes.TEXT},
	
	description:{type: DataTypes.TEXT},
	
	price:{type: DataTypes.DOUBLE},
	
	viewed:{
		
		type:DataTypes.BOOLEAN,
		
		defaultValue: false,
	
	},
	
	//sellerName:{type: DataTypes.TEXT},
	
	//sellerExperience:{type: DataTypes.TEXT},
	
	detectionTime:{

		type: DataTypes.DATE,

		allowNull: false,

		defaultValue: DataTypes.NOW,

	},
	
	//Является ли объект скрытым (удаленным)
	hidden:{
		
		type:DataTypes.BOOLEAN,
		
		defaultValue: false,
	
	},	
	
});



//------------------------------------------------------------------------------------------

const Avito_RequestModel = sequelize.define('Avito_Requests',{
	
	//Описание запроса
	description:{type: DataTypes.TEXT},
	
	//Текст запроса
	requestText:{type: DataTypes.TEXT},
	
	linkWithData:{type:DataTypes.TEXT},
	
	//Минимальная цена объекта
	minimumObjectPrice:{
		
		type:DataTypes.DOUBLE,
		
		defaultValue:1,
		
	},
	
	//Максимальная цена объекта
	maximumObjectPrice:{type: DataTypes.DOUBLE},
	
	//За сколько дней назад относительно текущей даты учитывать товары
	differenceFromCurrentDay:{type: DataTypes.INTEGER},
	
});


const Avito_KeywordsInObjectDescriptionModel = sequelize.define('Avito_KeywordsInObjectDescriptions',{
	
	Keywords:{type: DataTypes.TEXT},//Ключевые слова для поиска
	
});



const Avito_ObjectModel = sequelize.define('Avito_Objects',{
	
	//Ссылка на объявление на сайте
	linkOnSite:{type: DataTypes.TEXT},
	
	//Описание товара
	description:{type: DataTypes.TEXT},
	
	//Название товара на Авито
	name:{type: DataTypes.TEXT},
	
	//Цена товара
	price:{type: DataTypes.DOUBLE},
	
	//Просмотрен товар или нет
	viewed:{
		
		type:DataTypes.BOOLEAN,
		
		defaultValue: false,
	
	},
	
	
	//Время обнаружения товара
	detectionTime:{

		type: DataTypes.DATE,

		allowNull: false,

		defaultValue: DataTypes.NOW,

	},
	
	//Время размещения объявления
	creationTime:{

		type: DataTypes.DATE,

		allowNull: false,

	},
	
	//Является ли объект скрытым (удаленным)
	hidden:{
		
		type:DataTypes.BOOLEAN,
		
		defaultValue: false,
	
	},
	
});



//---------------------------------------------------------------------------------

//Каждый пользовать будет иметь множество телеграмм-чатов
userModel.hasMany(TelegramChatsModel,{
	
	foreignKey:{
		
		allowNull:false,
		
		
	}

});

TelegramChatsModel.belongsTo(userModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}
	
});






//Каждый пользовать будет иметь множество запросов
userModel.hasMany(FunPay_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
		
	}

});

FunPay_RequestModel.belongsTo(userModel,{
	
	foreignKey:{
		
		allowNull:false,
		
		
	}
	
});


//Каждый запрос будет иметь множество вариантов с добавлением ключевых фраз (слов, словосочетаний)
FunPay_RequestModel.hasMany(FunPay_KeywordsInObjectDescriptionModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}

});

FunPay_KeywordsInObjectDescriptionModel.belongsTo(FunPay_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}
	
});



//Каждый запрос будет иметь множество найденных объектов
FunPay_RequestModel.hasMany(FunPay_ObjectModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}

});

FunPay_ObjectModel.belongsTo(FunPay_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}
	
});




//Каждый пользовать будет иметь множество запросов
userModel.hasMany(Avito_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}

});

Avito_RequestModel.belongsTo(userModel,{
	
	foreignKey:{
		
		allowNull:false,
		
		
	}
	
});


//Каждый запрос будет иметь множество вариантов с добавлением ключевых фраз (слов, словосочетаний)
Avito_RequestModel.hasMany(Avito_KeywordsInObjectDescriptionModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}

});

Avito_KeywordsInObjectDescriptionModel.belongsTo(Avito_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}
	
});


//Каждый запрос будет иметь множество найденных объектов
Avito_RequestModel.hasMany(Avito_ObjectModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}

});

Avito_ObjectModel.belongsTo(Avito_RequestModel,{
	
	foreignKey:{
		
		allowNull:false,
		
	}
	
});


module.exports = {
	
    userModel,
	TelegramChatsModel,
	
	FunPay_RequestModel,
	FunPay_KeywordsInObjectDescriptionModel,
	FunPay_ObjectModel,
	
	Avito_RequestModel,
	Avito_KeywordsInObjectDescriptionModel,
	Avito_ObjectModel,
	
};








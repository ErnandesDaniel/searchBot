
//Подключаем модуль для отправки на email запросов
const nodemailer = require('nodemailer');

//Создаем транспортер для посылки сообщений на почту
let transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru',
  port: 465,
  secure: true,
  auth: {
    user: process.env.mailUser,
    pass: process.env.mailPassword,
  },
});

//Функция отправки  сообщения на почту
let sendConfirmationCode=async(email, subject, html)=>{
	
	await transporter.sendMail({
		
		from: process.env.mailUser,

		to: email,

		subject: subject,

		html:html,

	});		
		
}



//Экспортируем объект маршрутизации
module.exports= sendConfirmationCode;




function createConfirmationCode(){
	
	let alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let string = '';
	let randomIndex=0;
	let randomLetter='0';

	for (let i = 0; i < 8; i++){
		
		randomIndex = Math.floor(Math.random() * alphabet.length);
		randomLetter = alphabet[randomIndex];
		string=string+randomLetter;
		
	}
	
	return string;
	
};	
	


//Экспортируем объект маршрутизации
module.exports= createConfirmationCode;



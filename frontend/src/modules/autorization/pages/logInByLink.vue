<template>

  <div class='page'>

    <div class='goToEmailToLogIn' v-if='errorMessage==""'>Идет переход в ваш аккаунт...</div>

    <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>

  </div>

</template>

<script>

  import { logInByLink } from '../api/logInByLink.js';

  import { useAutorizationStore } from '../stores/autorization.js';

  import { getMainDataOfUser } from '@/modules/profile';

  export default {

    setup(){

      const autorizationStore=useAutorizationStore();
  
      const logIn=autorizationStore.logIn;

      return { logIn, }

    },

    data(){

      return{

        errorMessage:'',

      }
    },


    created(){

      let loginConfirmationToken=this.$route.query.loginConfirmationToken;

      logInByLink(loginConfirmationToken).then((response)=>{

        if(response.data.errorExist==true){

          if(response.data.actionMessage=='invalidLoginConfirmationToken'){

            this.errorMessage='Неверный или устаревший токен подтверждения входа';

          }else if(response.data.actionMessage=='userIsNotExist'){

            this.errorMessage='Пользователь не найден';

          }else if(response.data.actionMessage=='invalidConfirmationToken'){

            this.errorMessage='Невалидный токен подтверждения входа';

          }

        }else if(response.data.actionMessage=='tokenWasCreated'){

          let authorizationToken=response.data.content.token;

          //Устанавливаем значение статуса авторизации на правду
          localStorage.setItem('statusOfAuthorization', 'true');

          //Записываем токен авторизации
          localStorage.setItem('authorizationToken', authorizationToken);

          //Производим авторизацию в приложении
          this.logIn(authorizationToken);
                
          //Переходим на страницу входа
          this.$router.replace({path: '/'});
                
          //Получаем данные о пользователе
          getMainDataOfUser();

        }

      });

    },

  }

</script>

<style  scoped src="@/shared/assets/commonStyles.css"></style>

<style scoped>

  .page{

    display:flex;
    flex-direction:column;
    align-items:center;
    padding-top:40px;

  }

  .goToEmailToLogIn{

    width:230px;
    font-size:20px;
    margin-left:auto;
    margin-right:auto;
    display:flex;
    justify-content:center;
    text-align:center;
    //margin-top:20px;
    margin-bottom:10px;
    text-align:center;

  }

</style>
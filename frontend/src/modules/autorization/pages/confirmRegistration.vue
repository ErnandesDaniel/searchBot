<template>

  <div class='page'>

    <div class='successfulRegistration' v-if='successfulText!=""'>{{successfulText}}</div>

    <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>

      <router-link

        to='/autorization'

        class='specialButton goToEnter'

      >Перейти на страницу входа</router-link>
  
  </div>

</template>

<script>

  import { useAutorizationStore } from '../stores/autorization.js';

  import { confirmRegistration } from '../api/confirmRegistration.js';

  import { computed } from 'vue'

  import { authorize } from '@/shared/services/authorize.js';


  export default {

    data(){

      return{

        successfulText:'',

        confirmationToken:'',

        errorMessage:'',

        error:false,

      }
    },

    created(){

      this.confirmationToken=String(this.$route.query.confirmationToken);

      //Отсылаем код подтверждения
      this.sendConfirmationToken();

    },

    methods:{

      async sendConfirmationToken(){

        let response=await confirmRegistration({

          confirmationToken:this.confirmationToken,

        });

        console.log(response);

       if(response.data.errorExist==true){

          if(response.data.actionMessage=='registrationOfUserHasBeenConfirmed'){

            this.errorMessage='Пользователь уже зарегистрирован';

          }else if(response.data.actionMessage=='invalidConfirmationToken'){

            this.errorMessage='Неверный токен подтверждения';

          }else if(response.data.actionMessage=='userIsNotExist'){

            this.errorMessage='Пользователя не существует';

          }else if(response.data.actionMessage=='serverIsNotAvailable'){

            this.errorMessage='Нет доступа к серверу, попробуйте позже';

          }

        }else{

          this.successfulText='Аккаунт подтвержден!';

        }

      },

    }

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

  .successfulRegistration{

    width:230px;
    font-size:20px;
    margin-left:auto;
    margin-right:auto;
    display:flex;
    justify-content:center;
    text-align:center;
    margin-bottom:20px;

  }


  .goToEnter{

    margin-top:20px;
    text-transform: none;

  }

</style>
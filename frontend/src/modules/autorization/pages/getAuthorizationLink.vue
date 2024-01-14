<template>

  <div class='page'>

    <input class='specialInput' type='text' placeholder='Email' v-model='email'/>

    <div class='specialButton getCode' @click='getCode'>Получить токен входа</div>

    <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>
  
  </div>

</template>

<script>

  import { getAuthorizationLink } from '../api/getAuthorizationLink.js';

  export default {

    data(){

      return{

        
        email:'',

        errorMessage:'',

      }
    },


    //При вводе пароли или логина ошибка прошлого неверного ввода обнуляется
    watch:{

      email(){

        this.errorMessage='';

      },

    },

    methods:{

      async getCode(){

        if(this.email.length<1){

          this.errorMessage='Введите email';

        }else{

            //let response=await getAuthorizationLink(this.email);


/*
            if(response.data.errorExist==true){

              if(response.data.actionMessage=='invalidEmail'){

                this.errorMessage='Некорректный Email';

              }else if(response.data.actionMessage=='userIsNotExist'){

                this.errorMessage='Пользователь не найден';

              }

            }


*/

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

  .getCode{


    text-transform: none;
    //font-size:20px;
    //cursor:pointer;
    //margin-bottom:20px;
    //text-align:center;

  }

</style>

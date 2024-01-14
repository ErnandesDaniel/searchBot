<template>

  <div class='registrationBlock'>

    <input class='specialInput' type='text' placeholder='Email' v-model='email'/>

    <input class='specialInput' type='password'  placeholder='Пароль' v-model='password' autocomplete="new-password" />

    <input class='specialInput' type='password'  placeholder='Повторите пароль' v-model='repeatPassword' autocomplete="new-password" />


    <input class='specialInput' type='text'  placeholder='Имя' v-model='name'/>

    <button class='specialButton' v-on:click='requestToRegistration'>Зарегистрироваться</button>

    <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>

  </div>
  
</template>

<script>

  import { registerNewUser } from '../api/registerNewUser.js';

  export default {

    data(){

      return{

        
        email:'Ernandes20@yandex.ru',

        password:'12345678',

        repeatPassword:'12345678',

        name:'Даниэль',

        errorMessage:'',

      }
    },


    //При вводе пароли или логина ошибка прошлого неверного ввода обнуляется
    watch:{

      email(){

        this.errorMessage='';

      },

      password(){

        this.errorMessage='';

      },

      password(){

        this.repeatPassword='';

      },

      name(){

        this.errorMessage='';

      },

    },

    methods:{

      async requestToRegistration(){

        if(this.email.length<1){

          this.errorMessage='Введите email';

        }else if(this.password.length<1){

          this.errorMessage='Введите пароль';

        }else if(this.name.length<1){

          this.errorMessage='Введите имя';

        }else if(this.password!=this.repeatPassword){

            this.errorMessage='Пароли не совпадают';

        }else{

          let response=await registerNewUser({

            email:this.email,

            password:this.password,

            name:this.name,

          });

          console.log(response);

          if(response.data.errorExist==true){

            if(response.data.actionMessage=='invalidEmail'){

              this.errorMessage='Некорректный Email';

            }else if(response.data.actionMessage=='userHasBeenAlreadyRegistered'){

              this.errorMessage='Email уже был использован для регистрации';

            }

          }

        }

      }

    }

  }

</script>

<style  scoped src="@/shared/assets/commonStyles.css"></style>
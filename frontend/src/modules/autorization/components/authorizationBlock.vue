<template>

    <div class='authorizationBlock'>

      <input class='specialInput' type='text' placeholder='Email' v-model='email'/>

      <input class='specialInput' type='password' placeholder='Пароль' v-model='password'/>

      <button class='specialButton' v-on:click='requestToAuthorization'>Войти</button>

      <router-link

        to='/autorization/getAuthorizationLink'

        class='specialButton linkEnterButton'

      >Войти по ссылке</router-link>

      <router-link

        to='/autorization/recoverPassword'

        class='specialButton recoverPassword'

      >Восстановить пароль</router-link>

      <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>

    </div>
  
</template>

<script>

  import { authorize } from '@/shared/services/authorize.js';

  export default {

    data(){

      return{
        
        email:'',

        password:'',

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

    },

    methods:{

      async requestToAuthorization(){
        
        if(this.email.length<1){

          this.errorMessage='Введите email'

        }else if(this.password.length<8){

          this.errorMessage='Пароль слишком короткий'

        }else if(this.password.length<1){

          this.errorMessage='Введите пароль'


        }else{

          let response=await authorize(this.email, this.password);

          if(response.data.errorExist==true){

            if(response.data.actionMessage=='invalidPassword'){

              this.errorMessage='Неверный пароль';

            }else if(response.data.actionMessage=='userIsNotExist'){
  
              this.errorMessage='Пользователь не найден';

            }

          }

        }

      },

    },

  }
</script>


<style scoped src="@/shared/assets/commonStyles.css"></style>

<style scoped>

.recoverPassword{

  text-transform: none;
}

.linkEnterButton{

  text-transform: none;
  
}

</style>







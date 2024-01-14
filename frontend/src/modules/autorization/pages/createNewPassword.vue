<template>

  <div class='page'>

    <input class='specialInput' type='text' placeholder='Новый пароль' v-model='newPassword'/>

    <input class='specialInput' type='text' placeholder='Новый пароль еще раз' v-model='newPasswordSecond'/>

    <input class='specialInput' type='text' 

      placeholder='Код подтверждения' 
   
      v-model='confirmationCode'

    />


    <div class='createNewPassword' @click='createNewPassword'>Установить новый пароль</div>

    <div class='errorBlock' v-if='errorMessage!=""'>{{errorMessage}}</div>
  
  </div>

</template>

<script>

  import { useAutorizationStore } from '../stores/autorization.js';

  import { createNewPassword } from '../api/createNewPassword.js';

  export default {

    setup() {
  
      const autorizationStore=useAutorizationStore();
      return { autorizationStore }

    },

    data(){

      return{

        
        newPassword:'',

        newPasswordSecond:'',

        confirmationCode:'',

        errorMessage:'',

      }
    },


    //При вводе пароли или логина ошибка прошлого неверного ввода обнуляется
    watch:{

      newPassword(){

        this.errorMessage='';

      },

      newPasswordSecond(){

        this.errorMessage='';

      },

      confirmationCode(){

        this.errorMessage='';

      },

    },

    methods:{


      async createNewPassword(){

        if(this.newPassword.length<1){

          this.errorMessage='Введите пароль';

        }else if(this.newPasswordSecond.length<1){

          this.errorMessage='Введите пароль еще раз';

        }else if(this.confirmationCode.length<1){

          this.errorMessage='Введите код подтверждения';

        }else if(this.newPassword!=this.newPasswordSecond){

          this.errorMessage='Пароли должны совпадать';

        }else{

          let response =await createNewPassword({

            email:this.autorizationStore.email,

            newPassword:this.newPassword,

            confirmationCode:this.confirmationCode,

          });

          if(response.data.errorExist==true){

            if(response.data.actionMessage=='invalidEmail'){

              this.errorMessage='Некорректный Email';

            }else if(response.data.actionMessage=='userIsNotExist'){

              this.errorMessage='Пользователь не найден';

            }else if(response.data.actionMessage=='invalidConfirmationCode'){

              this.errorMessage='Неверный код подтверждения';

            }else if(response.data.actionMessage=='serverIsNotAvailable'){

              this.errorMessage='Нет доступа к серверу';

            }

          }

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

  .createNewPassword{

    font-size:20px;
    cursor:pointer;
    margin-bottom:20px;
    text-align:center;
    text-align:center;

  }

</style>

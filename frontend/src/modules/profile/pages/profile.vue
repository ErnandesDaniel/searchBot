<template>

<div class='page'>

  <div class='inputContent'>

    <contentBlock name='Имя' v-model="name" :disabled="!profileCanBeChanged"/>

  </div>

  <div 

    class='actionButton getCode'

    @click='TelegramAuthorization'

  >Получить токен ТГ-бота</div>


  <div

    class='actionButton workWithChanges'

    @click='workWithChanges'

    >{{changeButtonText}}

  </div>


  <div 

  class='message'

  v-if='messageText.length>0'

  >{{ messageText }}</div>


</div>

</template>


<script>

  import contentBlock from '../components/contentBlock.vue';

  import { useMainDataStore } from '@/shared/stores/mainData.js';
  
  import { updateMainDataOfUser } from '../api/updateMainDataOfUser.js';

  import { getTelegramAuthorizationToken } from '../api/getTelegramAuthorizationToken.js';

  import { storeToRefs } from 'pinia';

  export default{

    setup(){


      let { name }=storeToRefs(useMainDataStore());

      return{ name }

    },

    data(){
      return{

        profileCanBeChanged:false,

        messageText:'',

      }
    },


    computed:{


      changeButtonText(){

        if(this.profileCanBeChanged==true){

          return 'Сохранить изменения';

        }else if(this.profileCanBeChanged==false){
          
          return 'Измененить данные';

        }
        
      }

    },


    methods:{


      workWithChanges(){

        if(this.profileCanBeChanged==true){

         this.saveChanges();

        }else if(this.profileCanBeChanged==false){
          
          this.addChanges();

        }


      },

      addChanges(){

        this.profileCanBeChanged=true;

      },

      saveChanges(){

        //Создаем объект для отправки на сервер
        let mainDataOfUser={

          name:this.name,

        }

        //Отправляем данные на сервер
        updateMainDataOfUser(mainDataOfUser);

        this.profileCanBeChanged=false;

      },

      async TelegramAuthorization(){

        let response = await getTelegramAuthorizationToken();

        if(response.data.actionMessage=='TelegramAuthorizationTokenWasSent'){

          this.messageText='На вашу почту отправлен токен авторизации ТГ';

          setTimeout(()=>{

            this.messageText='';

          }, 1500);

        }

      },

    },

    components:{

      contentBlock

    },

  }

</script>

<style scoped src="@/shared/assets/commonStyles.css"></style>


<style scoped>

  .page{

    height:calc(100% - 56px);
    width:100%;
    padding-top:40px;
    padding-left:10px;

    display:flex;
    flex-direction:column;
    align-items:center;
    position:relative;

  }


  .actionButton{

    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:20px;
    height: 48px;
    width: 95%;
    margin-left:auto;
    margin-right:auto;
    margin-top:20px;
    text-align:center;
    padding-left:10px;
    padding-right:10px;


    font-style: normal;
    font-size: 18px;
    line-height: 22px;
    color: rgba(0, 0, 0, 0.5);
    background: #D8D5D5;
    cursor:pointer;
    user-select:none;

    font-weight: bold;
    background:#D9D9D9;


  }

  .getCode{


    background: #70A372;

  }



  .message{

    font-size: 18px;
    line-height: 22px;
    margin-top:20px;
    text-align:center;
    padding-left:10px;
    padding-right:10px;

  }


</style>
























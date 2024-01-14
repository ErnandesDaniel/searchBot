<template>

<div class='page'>

  <router-link 

    class='specialButton siteListButton' 

    :to='"/siteList/"+this.$route.params.siteName+"/requestsList"'

    >Обратно к списку запросов</router-link>


  <contentBlock

  v-for='(characteristic, index) in requestCharacteristics'

  :description='characteristic.description'

  :type='characteristic.type'

  v-model='characteristic.value'

  :index='index'

  :emptyError='characteristic.emptyError'

  v-on:removeEmptyError='removeEmptyError(index, "requestCharacteristics")'

  />

  <contentBlock

    v-for='(keyWord, index) in keyWordsArray'

    :description='"Ключевое словосочетание №"+" "+(index+1)'

    :canBeDeleted='true'

    v-model='keyWord.value'

    :index='index'

    v-on:deleteBlock='deleteKeyWordBlock'

    :emptyError='keyWord.emptyError'

    v-on:removeEmptyError='removeEmptyError(index, "keyWordsArray")'

  />

 <div 

  class='actionButton'

  @click='addKeyWord'

  >Добавить ключевое словосочетание</div>

 <div 

  class='actionButton'

  @click='addRequest'

  >Создать поисковый запрос</div>

</div>

</template>


<script>

import contentBlock from '../components/contentBlock.vue'; 

import router from '@/router/index.js';

import { useMainDataStore } from '@/shared/stores/mainData.js';

import { computed } from 'vue';

import { createRequest } from '../api/createRequest.js';

  export default{

    setup(){

      let mainDataStore=useMainDataStore();
      
      let setNameOfPage=mainDataStore.setNameOfPage;

      //Получаем текущий путь
      let currentRoute=router.currentRoute.value;

      const siteName=currentRoute.params.siteName

      const requestId=currentRoute.params.requestId;

      setNameOfPage(`Создание запроса для сайта ${siteName}`);


      let analyzedSites=computed(()=>mainDataStore.analyzedSites);

      return { analyzedSites }

    },

    created(){

      console.log(this.$route.params.siteName);

      //Получаем объект анализируемого сайта
      let analyzedSite=this.analyzedSites.find((el)=>this.$route.params.siteName==el.name);

      this.requestCharacteristics=analyzedSite.requestCharacteristics.map((el)=>{

        return {

          name:el.name,

          description:el.description,

          type:el.type,

          canBeEmpty:el.canBeEmpty,

          value:'',

          emptyError:false,

        }

      });



    },

    data(){

      return{

        requestCharacteristics:[],

        keyWordsArray:[],


      }

    },

    methods:{

      addKeyWord(){

        this.keyWordsArray.push({value:'', emptyError:false,});

      },

      deleteKeyWordBlock(index){

        console.log(index);

        this.keyWordsArray.splice(index, 1);

      },

      removeEmptyError(index, nameOfArray){

        console.log(this[nameOfArray][index]);

        this[nameOfArray][index]={...this[nameOfArray][index], emptyError:false};


      },

      //Проверяем пустые input
      checkForEmpty(nameOfArray){

        let error=false;

        for(let i=0; i<this[nameOfArray].length; i++){
          
          if(this[nameOfArray][i].value.length==0 && this[nameOfArray][i].canBeEmpty!=true){

            this[nameOfArray][i]={...this[nameOfArray][i], emptyError:true};

            error=true;
           
          }

        }

        return error;

      },


      addRequest(){

        let error1=this.checkForEmpty('requestCharacteristics');
        let error2=this.checkForEmpty('keyWordsArray');

        //Если все массивы данных заполнены, то можно их отправлять на сервер
        if(error1==false && error2==false){

          let newRequest={};

          //Заполняем поля нового объекта запроса
          this.requestCharacteristics.forEach((el)=>{

            let value=el.value;

            if(el.type=='Number'){

              console.log(el.value);

              value=Number(el.value);

            }

            newRequest[el.name]=value;

          });


          //Создаем массив ключевых слов
          let keyWords=this.keyWordsArray.map((el)=>{

            return el.value;

          });

          //Добавляем ключевые слова в объект запроса
          newRequest.keywordsInObjectDescription=keyWords;

          //Отправляем объект запроса на сервер
          createRequest(newRequest, this.$route.params.siteName);

        }

      },

    },

    components:{

      contentBlock,

    }

  }

</script>


<style scoped src="@/shared/assets/commonStyles.css"></style>

<style scoped>

  .page{

    height:calc(100% - 56px);
    width:100%;
    padding-top:40px;
    padding-left:10px;
    padding-bottom:20px;
    overflow:auto;

  }

  .siteListButton{

    margin-left:auto;
    margin-right:auto;
    text-transform: none;


  }

  .actionButton{

    height:50px;
    min-height:50px;

    display:flex;
    justify-content:center;
    align-items:center;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:20px;
    text-align:center;
    padding-left:10px;
    padding-right:10px;


    font-style: normal;
    font-size: 18px;
    line-height: 22px;
    color: black;
    cursor:pointer;
    user-select:none;

    font-weight: bold;
    background:#D9D9D9;

    border-radius:5px;
    border-color:black;
    border-style:solid;
    border-width:2px;
    width:calc(100% - 20px);


  }


</style>
























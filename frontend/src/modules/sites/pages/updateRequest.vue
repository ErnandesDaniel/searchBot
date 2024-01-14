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

  @click='changeRequest'

  >Обновить поисковый запрос</div>

  <div 

  class='actionButton'

  @click='deleteRequest'

  >Удалить поисковый запрос</div>

</div>

</template>


<script>

import contentBlock from '../components/contentBlock.vue'; 

import { useMainDataStore } from '@/shared/stores/mainData.js';

import { computed } from 'vue';

import router from '@/router/index.js';

import { useRequestsStore } from '../stores/requests.js';

import { updateRequest } from '../api/updateRequest.js';

import { deleteRequest } from '../api/deleteRequest.js';

import { getRequests } from '../api/getRequests.js';


  export default{

    //Защищаем путь от ошибки в имени сайта и id
    async beforeRouteEnter(to, from){

      let siteName=to.params.siteName;

      const mainDataStore=useMainDataStore();

      const analyzedSites=computed(()=>mainDataStore.analyzedSites);

      //Если получаемый из адресной строки сайт не найден в массиве 
      //анализируемых сайтов, то переходим на страницу со списком сайтов
      if(analyzedSites.value.findIndex((el)=>el.name==to.params.siteName)==-1){

        router.push({path:'/', repalce:true});

      }else{

        const requestsStore=useRequestsStore();

        const requestsList=computed(()=>requestsStore.requestsList);

        let requestId=to.params.requestId;

        //Изначально ошибка id считается ложью
        let requestIdError=false;

        if(

          //Если имя сайта, с которого отображаются запросы пусто
          requestsStore.siteName.length==0 

          ||

          (

            //Или сайт, с которого отображаются запросы не равен сайту, который сейчас имеется
            requestsStore.siteName.length>0

            &&

            siteName!=requestsStore.siteName

          )

        ){

          //Устанавливаем пустой массив списка запросов (чтобы не отображался прошлый)
          requestsStore.setRequestsList([]);

          //Устанавливаем имя сайта, с которого отображаются запросы
          requestsStore.setSiteName(siteName);

          //Создаем HTTP-запрос на получение списка запросов по имени сайта
          let response=await getRequests(siteName);

          if(response.data.errorExist==true){

            requestIdError=true;
          }

        }

        //Таким образом, если не произошел переход на другую страницу,
        //был получен обновленный список всех запросов для данного сайта
        
        //Проверяем, есть ли в списке запросов id этого запроса

        if(requestIdError==false){

          if(requestsList.value.findIndex((el)=>el.id==requestId)==-1){
          
            //Если в списке запросов не найден id из адресной строки,
            //то переходим на страницу с запросами путем указания правдивости ошибки

            requestIdError=true;

          } 

        }

        if(requestIdError==true){
            
            router.push({path:`/siteList/${siteName}/requestsList`, repalce:true});

        }

      }
      
    },

    setup(){

      const mainDataStore=useMainDataStore();

      const analyzedSites=computed(()=>mainDataStore.analyzedSites);

      const requestsStore=useRequestsStore();

      const requestsList=computed(()=>requestsStore.requestsList);

      let setNameOfPage=mainDataStore.setNameOfPage;

      //Получаем текущий путь
      let currentRoute=router.currentRoute.value;

      const siteName=currentRoute.params.siteName

      const requestId=currentRoute.params.requestId;

      setNameOfPage(`Обновление запроса № ${requestId}  для сайта ${siteName}`);

      return { requestsList, analyzedSites, requestsStore }

    },

    created(){
      
      this.requestId=Number(this.$route.params.requestId);

      this.siteName=this.$route.params.siteName;

      //Ссылка на объект запроса
      let request=this.requestsList.find((el)=>el.id==this.requestId);

      this.keyWordsArray=request.keywordsInObjectDescription.map((el)=>{

        return {value:el, emptyError:false,}

      });

      //Получаем объект анализируемого сайта
      let analyzedSite=this.analyzedSites.find((el)=>this.$route.params.siteName==el.name);

      this.requestCharacteristics=analyzedSite.requestCharacteristics.map((el)=>{

        return {

          name:el.name,

          description:el.description,

          type:el.type,

          canBeEmpty:el.canBeEmpty,

          value:request[el.name],

          emptyError:false,

        }

      });

    },

    data(){

      return{

        requestId:'',

        siteName:'',

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


          console.log(this[nameOfArray][i].canBeEmpty);

          if(this[nameOfArray][i].value.length==0 && this[nameOfArray][i].canBeEmpty!=true){

            this[nameOfArray][i]={...this[nameOfArray][i], emptyError:true};

            error=true;
           
          }

        }

        return error;

      },


      changeRequest(){

        let error1=this.checkForEmpty('requestCharacteristics');
        let error2=this.checkForEmpty('keyWordsArray');

        //Если все массивы данных заполнены, то можно их отправлять на сервер
        if(error1==false && error2==false){

          let updatedRequest={};

          //Заполняем поле id запроса
          updatedRequest.id=this.requestId;

          //Заполняем поля нового объекта запроса
          this.requestCharacteristics.forEach((el)=>{

            let value=el.value;

            if(el.type=='Number'){

              console.log(el.value);

              value=Number(el.value);

            }

            updatedRequest[el.name]=value;

          });

          //Создаем массив ключевых слов
          let keyWords=this.keyWordsArray.map((el)=>{

            return el.value;

          });

          //Добавляем ключевые слова в объект запроса
          updatedRequest.keywordsInObjectDescription=keyWords;

          //Отправляем объект запроса на сервер
          updateRequest(updatedRequest, this.siteName);

        }

      },

      async deleteRequest(){

        let response=await deleteRequest(this.siteName, this.requestId);

        if(response.data.errorExist==false){

          //Переходим на страницу со списком запросов
          this.$router.push({path:`/siteList/${this.siteName}/requestsList/`, replace:true});

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
























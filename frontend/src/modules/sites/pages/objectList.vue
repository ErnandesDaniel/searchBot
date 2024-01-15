<template>

<div class='page'>

  <router-link 

    class='specialButton siteListButton'

    :to='"/siteList/"+this.$route.params.siteName+"/requestsList"'


  >Обратно к списку запросов</router-link>

  <div 

    v-if="objectsList.length==0"

    class='informationText'


  >Товаров по этому запросу нет</div>

  <div

    class='content'

    v-else

  >

    <label class="custom-radio">
      <input type="radio" name="color" v-model="viewedMode" :value='false'>
      <span>Отображать только непросмотренные товары</span>
    </label>

    <label class="custom-radio">
      <input type="radio" name="color" v-model="viewedMode" :value='true'>
      <span>Отображать только просмотренные товары</span>
    </label>

    <objectBlock

      v-for='object in viewedObjectsList'

      :key='object.id'

      v-on:deleteObject='deleteObjectByIndex'

      v-on:updateViewed='updateViewedByIndex'

      :objectData='object'

      :objectId='object.id'

    />


    <observer v-on:intersect='getObjectsList'/>

</div>


</div>

</template>


<script>

import objectBlock from '../components/objectBlock.vue'; 

import observer from '../components/observer.vue'; 

import { useMainDataStore } from '@/shared/stores/mainData.js';

import router from '@/router/index.js';

import { computed } from 'vue';

import { useRequestsStore } from '../stores/requests.js';

import { getRequests } from '../api/getRequests.js';

import { getObjects } from '../api/getObjects.js';

import { updateObject } from '../api/updateObject.js';

import { deleteObject } from '../api/deleteObject.js';

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

      let setNameOfPage=mainDataStore.setNameOfPage;

      //Получаем текущий путь
      let currentRoute=router.currentRoute.value;

      //Получаем имя для текущего сайта
      let siteName=computed(()=>currentRoute.params.siteName);

      //Получаем номер запроса
      let requestId=computed(()=>currentRoute.params.requestId);

      setNameOfPage(`Товары запроса № ${requestId.value} на сайте ${siteName.value}`);

      return{siteName, requestId}

    },


    data(){

      return{

        objectsList:[],

        currentPage:0,

        totalPages:1,

        totalObjects:0,

        limit:10,

        observer:null,

        viewedMode:false,

      }
    },

    created(){

      this.getObjectsList();

    },



    computed:{

      viewedObjectsList(){

        return this.objectsList.filter((el)=>{

          return el.viewed==this.viewedMode;

        });

      },

    },


    methods:{

      async deleteObjectByIndex(objectId){

        let siteName=this.$route.params.siteName;

        let requestId=this.$route.params.requestId;

        let response=await deleteObject(siteName, requestId, objectId);

        if(response.data.actionMessage=='objectWasDeleted'){

           let index=this.objectsList.findIndex((el)=>{return el.id==objectId});

          //Начиная с индекса index, удалить 1 элемент
          this.objectsList.splice(index, 1);

        }

      },


      async updateViewedByIndex(state){

        let objectId=state.objectId;

        let viewed=state.viewed;

        let siteName=this.$route.params.siteName;

        let requestId=this.$route.params.requestId;

        let response=await updateObject(siteName, requestId, objectId, {viewed:viewed});

        if(response.data.actionMessage=='objectWasUpdated'){

          let index=this.objectsList.findIndex((el)=>{return el.id==objectId});

          this.objectsList=this.objectsList.map((el)=>{

            if(el.id==objectId){
                
              return {...el, viewed:viewed };
                
            }else{
                
              return {...el};
                
            }
              
          });

        }

      },

      async getObjectsList(){

        let error=false;

        //await this.objectsList=

        if(this.currentPage==0){

          let response=await getObjects(this.siteName, this.requestId, 0, this.limit);

          if (response.data.errorExist==false){

            let {

              listOfObjects,

              totalObjects,

              totalPages,

            }=response.data.content;
            
            this.totalObjects=totalObjects;

            this.totalPages=totalPages;

            console.log(listOfObjects);

            this.objectsList=listOfObjects;

            this.currentPage=this.currentPage+1;

          }

        }else if(this.currentPage<this.totalPages){

          let response=await getObjects(this.siteName, this.requestId, this.currentPage, this.limit);

          if (response.data.errorExist==false){

            let {listOfObjects,}=response.data.content;

            console.log(listOfObjects);

            //Добавляем в массив объектов только что полученные
            this.objectsList.push(...listOfObjects);

            this.currentPage=this.currentPage+1;

          }


        }

      },

    },

    components:{

      objectBlock,

      observer,

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

    display:flex;
    flex-direction:column;
    align-items:center;
    position:relative;
    overflow:auto;

  }

  .newRequestButton{

     text-transform: none;

  }

  .siteListButton{

    text-transform: none;

  }

  .informationText{

    font-size:20px;
    font-weight:bold;

  }


.content{


  width:100%;
}




label{

  margin-bottom:20px;
  display:block;
  font-size:20px;

}

/* для элемента input c type="radio" */
.custom-radio>input {
  position: absolute;
  z-index: -1;
  opacity: 0;
}

/* для элемента label связанного с .custom-radio */
.custom-radio>span {
  display: inline-flex;
  align-items: center;
  user-select: none;
}

/* создание в label псевдоэлемента  before со следующими стилями */
.custom-radio>span::before {
  content: '';
  display: inline-block;
  width: 1em;
  height: 1em;
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid #adb5bd;
  border-radius: 50%;
  margin-right: 0.5em;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 50% 50%;
}

/* стили при наведении курсора на радио */
.custom-radio>input:not(:disabled):not(:checked)+span:hover::before {
  border-color: #b3d7ff;
}

/* стили для активной радиокнопки (при нажатии на неё) */
.custom-radio>input:not(:disabled):active+span::before {
  background-color: #b3d7ff;
  border-color: #b3d7ff;
}

/* стили для радиокнопки, находящейся в фокусе */
.custom-radio>input:focus+span::before {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

/* стили для радиокнопки, находящейся в фокусе и не находящейся в состоянии checked */
.custom-radio>input:focus:not(:checked)+span::before {
  border-color: #80bdff;
}

/* стили для радиокнопки, находящейся в состоянии checked */
.custom-radio>input:checked+span::before {
  border-color: #0b76ef;
  background-color: #0b76ef;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
}

/* стили для радиокнопки, находящейся в состоянии disabled */
.custom-radio>input:disabled+span::before {
  background-color: #e9ecef;
}



</style>
























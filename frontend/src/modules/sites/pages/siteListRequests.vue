<template>

<div class='page'>


  <router-link 

    class='specialButton siteListButton' 

    to='/siteList/'

  >Обратно к списку сайтов</router-link>

  <router-link 

    class='specialButton newRequestButton' 

    :to='"/siteList/"+this.$route.params.siteName+"/createRequest"'

  >Создать поисковый запрос</router-link>


  <div 

    v-if="requestsList.length==0"

    class='informationText'


  >Поисковых запросов нет</div>

  <div v-else>

<requestBlock

  v-for='(request, index) in requestsList'

  :key='request.id'

  v-on:updateRequest='updateRequest'

  v-on:deleteRequest='deleteRequestByIndex'
  
  v-on:showProductList='showProductList'
  
  :description='request.description'

  :maximumObjectPrice='request.maximumObjectPrice'

  :index='index'

/>

</div>

</div>

</template>


<script>

import requestBlock from '../components/requestBlock.vue'; 

import { useMainDataStore } from '@/shared/stores/mainData.js';

import router from '@/router/index.js';

import { computed } from 'vue';

import { getRequests } from '../api/getRequests.js';

import { deleteRequest } from '../api/deleteRequest.js';

import { useRequestsStore } from '../stores/requests.js';

  export default{

    //Защищаем путь от ошибок в имени сайта
    beforeRouteEnter(to, from){

      const mainDataStore=useMainDataStore();

      const analyzedSites=computed(()=>mainDataStore.analyzedSites);

      //Если получаемый из адресной строки сайт не найден в массиве 
      //анализируемых сайтов, то переходим на страницу со списком сайтов
      if(analyzedSites.value.findIndex((el)=>el.name==to.params.siteName)==-1){

        router.push({path:'/', repalce:true});

      }
      
    },


    setup(){

      const mainDataStore=useMainDataStore();

      const requestsStore=useRequestsStore();

      let setNameOfPage=mainDataStore.setNameOfPage;

      //Получаем текущий путь
      let currentRoute=router.currentRoute.value;

      let siteName=computed(()=>currentRoute.params.siteName);


      setNameOfPage('Запросы на сайте '+currentRoute.params.siteName);

      const requestsList=computed(()=>requestsStore.requestsList);

      return{ requestsStore, requestsList, siteName};

    },


    data(){

      return{

      }
    },

    created(){

      this.updateRequestsList();

    },

    methods:{

      showProductList(index){

        let requestId=this.requestsList[index].id

        //Переходим на сатринцу со списком товаров
        this.$router.push({

          path:`/siteList/${this.siteName}/${requestId}/objectsList/`,});

      },

      updateRequest(index){

        let siteName=this.$route.params.siteName;

        let requestId=this.requestsList[index].id;

        //Переходим на страницу обновления запроса
        router.push({path:`/siteList/${siteName}/updateRequest/${requestId}`});

      },

      deleteRequestByIndex(index){

        deleteRequest(this.$route.params.siteName, this.requestsList[index].id);

      },

      async updateRequestsList(){

       if(

              //Если имя сайта, с которого отображаются запросы пусто
              this.requestsStore.siteName.length==0 

              ||

              (


                //Или сайт, с которого отображаются запросы не равен сайту, который сейчас имеется
                this.requestsStore.siteName.length>0 

                &&

                this.$route.params.siteName!=this.requestsStore.siteName

              )

              ){

                //Устанавливаем пустой массив списка запросов (чтобы не отображался прошлый)
                this.requestsStore.setRequestsList([]);

                //Устанавливаем имя сайта, с которого отображаются запросы
                this.requestsStore.setSiteName(this.$route.params.siteName);

                //Создаем HTTP-запрос на получение списка запросов по имени сайта
                await getRequests(this.$route.params.siteName);

            }

      },

    },

    components:{

      requestBlock,

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


</style>
























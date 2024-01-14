<template>

<div id='menu'>

  <div class='nav' @click='toggleLinkVisibility' v-if='statusOfAuthorization==true'>

    <img :src="require('@/shared/assets/'+navBarIconName)"/>

  </div>

  <div class='nameOfPage'>{{nameOfPage}}</div>

</div>

<div class='backgroundBlock' v-if='linkVisibility==true'>

  <div class='linkBlock'>

    <router-link class='link' to='/siteList'>Анализируемые сайты</router-link>

    <router-link class='link' to='/profile'>Профиль</router-link>

  </div>

  <div class='buttonBlock'>


    <div 

      class='downloadApplication'

    >Установить веб-приложение</div>

    <div 

      class='logOut' 

      @click='logOut'

      v-if='statusOfAuthorization==true'

    >Выйти</div>

  </div>


</div>


</template>

<script>

  import { useMainDataStore } from '@/shared/stores/mainData.js';
  import { storeToRefs } from 'pinia';
  import { disauthorize } from '@/shared/services/disauthorize.js';

  export default{

    setup(){

      const mainDataStore=useMainDataStore();

      let { statusOfAuthorization, nameOfPage }=storeToRefs(mainDataStore);

      let setNameOfPage=mainDataStore.setNameOfPage;

      return{ statusOfAuthorization, nameOfPage, setNameOfPage };

    },

    data(){

      return{

        linkVisibility:false,

        storedNameOfPage:'',

        navBarIconName:'menuBar.svg',

      }
    },

    created(){

      //Регистрируем обработчик события перехода на другую страницу
      this.$router.afterEach((to, from)=>{

        this.setNameOfPage(this.$route.meta.nameOfPage);

        this.setLinkVisibility(false);

        this.navBarIconName='menuBar.svg';

      });

    },

    methods:{

      setLinkVisibility(stateOfLinkVisibility){

        this.linkVisibility=stateOfLinkVisibility;

      },

      toggleLinkVisibility(){

        if(this.linkVisibility==true){

          this.setLinkVisibility(false);

          //При сокрытии меню указываем сохраненное имя страницы
          this.setNameOfPage(this.storedNameOfPage);

          this.navBarIconName='menuBar.svg';


        }else if(this.linkVisibility==false){

          //Запоминаем имя текущей страницы
          this.storedNameOfPage=this.nameOfPage;

          this.setLinkVisibility(true);

          this.navBarIconName='backArrow.svg';

          this.setNameOfPage('Главное меню');

          
        }

      },

      logOut(){

        disauthorize();
      },

    },

  }

</script>


<style scoped>

  #menu{

    height:56px;
    width:100%;
    display:flex;

  }

  #menu>.nav{

    padding-top:8px;
    width:60px;
    height:56px;
    display:flex;
    flex-direction:column;
    align-items:center;
    cursor:pointer;

  }

  #menu>.nameOfPage{

    font-size:20px;
    height:100%;
    display:flex;
    justify-content:center;
    text-align:center;
    padding-left:10px;
    padding-right:10px;
    align-items:center;
    width:calc(100% - 60px);

  }

  .backgroundBlock{

    position:absolute;
    z-index:2;
    top:56px;
    left:0px;
    width:100%;
    height:calc(100% - 56px);
    background:white;

  }

  .linkBlock{

    padding-left:10px;
    padding-top:10px;

  }

  .linkBlock>.link{

    display:block;
    font-size:20px;
    margin-bottom:20px;

  }


  .router-link-active{

    text-decoration: underline;

  }

  .buttonBlock{

    position:absolute;
    z-index:2;
    width:100%;
    height:auto;
    bottom:0px;

  }

 .buttonBlock>div{

    display:flex;
    justify-content:center;
    align-items:center;
    border-radius:20px;
    height: 48px;
    width: 95%;
    margin-left:auto;
    margin-right:auto;


    font-style: normal;
    font-size: 18px;
    line-height: 22px;
    cursor:pointer;
    user-select:none;

    margin-bottom:15px;

    font-weight: bold;

    color: white;
    background:#70A372;
 }


.buttonBlock>.logOut{

    color: rgba(0, 0, 0, 0.5);
    background:#D9D9D9;

}
  

</style>

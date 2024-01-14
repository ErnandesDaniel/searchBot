<template>

  <div 

    class='errorMessage'

    v-if='errorMessageText.length>0'

    >{{errorMessageText}}</div>

</template>

<script>

  import { useMainDataStore } from '@/shared/stores/mainData.js';

  import { storeToRefs } from 'pinia';

  export default{

    setup(){

      let mainDataStore=useMainDataStore();

      let setErrorMessageText=mainDataStore.setErrorMessageText;
 
      let {errorMessageText, }=storeToRefs(useMainDataStore());

      return{ errorMessageText, setErrorMessageText}

    },

    watch:{

      errorMessageText(){

        if(this.errorMessageText.length>0){

          setTimeout(()=>{this.setErrorMessageText('');}, 3000);

        }

      }

    },

  }

</script>


<style scoped>

  .errorMessage{

    width:80%;
    min-height:40px;
    padding:10px;
    color:white;
    background:black;
    position:absolute;
    bottom:20px;
    left:0px;
    right:0px;
    margin-left:auto;
    margin-right:auto;
    text-align:center;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:18px;
    border-radius:20px;


  }

</style>

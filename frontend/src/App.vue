<template>

  <navBar/>

  <router-view/>
  
  <errorMessage/>

</template>

<script>

  import navBar from '@/shared/components/navBar.vue';
 
  import errorMessage from '@/shared/components/errorMessage.vue';

  import { loading } from '@/shared/services/loading.js';

  export default{

    components:{

      navBar,
	  
	  errorMessage,
	  

    },

  }

</script>

<style scoped>

  #app {

    width:100%;
    height:100%;
    overflow:hidden;

  }

</style>

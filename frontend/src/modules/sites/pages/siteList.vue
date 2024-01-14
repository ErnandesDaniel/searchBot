<template>

<div class='page'>

  <router-link 

    class='link'

    to='/siteList/FunPay/requestsList'

  >FunPay</router-link>

  <router-link 

    class='link' 

    to='/siteList/Avito/requestsList/'

  >Avito</router-link>


</div>

</template>


<script>


  export default{










  }

</script>


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


  .link{
    
    font-size:20px;
    margin-bottom:20px;

  }

</style>
























<template>

  <div class='page'>

    <div class='needForConfirmationEmail'>Для подтверждения аккаунта перейдите по ссылке из письма, которое было отправлено на указаный вами Email</div>
  
  </div>

</template>

<script>

  export default {

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

  .needForConfirmationEmail{

    width:230px;
    font-size:20px;
    margin-left:auto;
    margin-right:auto;
    display:flex;
    justify-content:center;
    text-align:center;
    //margin-top:20px;
    margin-bottom:10px;
    text-align:center;

  }

</style>
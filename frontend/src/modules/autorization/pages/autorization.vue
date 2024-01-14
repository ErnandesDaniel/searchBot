<template>

  <div class='page'>

    <choosingStatuses class='choosingStatuses'/>

    <authorizationBlock v-if='authorizationSelectedBlock=="authorization"'/>

    <registrationBlock v-if='authorizationSelectedBlock=="registration"'/>

  </div>
  
</template>

<script>

  import { computed } from 'vue'

  import { useAutorizationStore } from '../stores/autorization.js'

  import choosingStatuses  from '../components/choosingStatuses.vue'

  import authorizationBlock  from '../components/authorizationBlock.vue'

  import registrationBlock  from '../components/registrationBlock.vue'

  export default {

    components:{

      choosingStatuses,

      authorizationBlock,

      registrationBlock,

    },


    setup() {

      const authorizationSelectedBlock=computed(
        
        ()=>useAutorizationStore().authorizationSelectedBlock

      );

      return {authorizationSelectedBlock }

    },
  }

</script>

<style scoped>

  .page{

    height:calc(100% - 56px);
    width:100%;
    padding-top:max(3%, 20px);
    overflow:auto;

  }

  .recoverPassword{

    display:block;
    font-size:20px;
    color:rgba(0,0,0, 0.5);
    width:100%;
    text-align:center;
    cursor:pointer;
  }

</style>


<style  scoped src="@/shared/assets/commonStyles.css"></style>



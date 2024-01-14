<template>
  
  <div>

    <div class='selectStatus'>

      <p 

        v-on:click='changeAuthorizationSelectedBlock("authorization")'

        v-bind:class='{ selectedStatus:authorizationSelectedBlock=="authorization"}'

      >Вход</p>

      <p 

        v-on:click='changeAuthorizationSelectedBlock("registration")'

        v-bind:class='{ selectedStatus:authorizationSelectedBlock=="registration"}'

      >Регистрация</p>

    </div>

  </div>

</template>

<script>

  import { useAutorizationStore } from '../stores/autorization.js'

  import { computed } from 'vue'

  export default {

    setup() {

      const autorizationStore=useAutorizationStore();

      const setAuthorizationSelectedBlock=autorizationStore.setAuthorizationSelectedBlock;

      const setRoleSelectedBlock=autorizationStore.setRoleSelectedBlock;

      const role=computed(()=>autorizationStore.role);

      const authorizationSelectedBlock=computed(()=>autorizationStore.authorizationSelectedBlock);

      return { 

        setAuthorizationSelectedBlock, 

        setRoleSelectedBlock, 

        role,

        authorizationSelectedBlock,

      }

    },

    methods:{

      changeAuthorizationSelectedBlock(authorizationSelectedBlock){

        this.setAuthorizationSelectedBlock(authorizationSelectedBlock);

      },

      changeRoleSelectedBlock(roleSelectedBlock){

        this.setRoleSelectedBlock(roleSelectedBlock);

      },

    }

  }

</script>

<style scoped>

  .selectStatus{

    border-radius:25px;
    display:flex;
    align-items:center;
    justify-content:space-around;
    width:250px;
    margin-left:auto;
    margin-right:auto;
    margin-bottom:20px;

  }

  .selectStatus>p{

    display:flex;
    align-items:center;
    text-align:center;
    color:rgba(0, 0, 0, 0.7);
    font-style:normal;
    font-weight:700;
    font-size:14px;
    justify-content:center;
    text-transform:capitalize;
    height:40px;
    min-width:111px;
    padding-left:10px;
    padding-right:10px;
    border-radius:20px;
    cursor:pointer;
    background:#D9D9D9;

  }

  .selectStatus>.selectedStatus{

   background: #70A372;

  }


</style>

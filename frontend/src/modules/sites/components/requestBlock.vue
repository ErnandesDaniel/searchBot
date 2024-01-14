<template>

  <div class='requestBlock'>

    <div class='descriptionOfBlock'>Описание запроса: {{description}}</div>

    <div class='descriptionOfBlock'>Максимальная цена объектов: {{maximumObjectPrice}} р</div>

    <div 

      class='ActionButton' 

      v-on:click='showProductList'

    >Показать список товаров</div>

    <div 

      class='ActionButton' 

      v-on:click='updateRequest'

    >Изменить запрос</div>

    <!--<div 

      class='ActionButton' 

      v-on:click='deleteRequest'

    >Удалить запрос</div>-->



  </div>

</template>

<script>

export default{

  data(){

    return{

    }

  },

  props:{

    description:String,

    index:Number,

    maximumObjectPrice:Number,

  },


  methods:{


    showProductList(){
      
      //Отправляем сообщение о необходимости удалить блок
      this.$emit('showProductList', this.index);

    },

    updateRequest(){

      //Отправляем сообщение о необходимости удалить блок
      this.$emit('updateRequest', this.index);

    },

    deleteRequest(){

      //Отправляем сообщение о необходимости удалить блок
      this.$emit('deleteRequest', this.index);

    },

  }

}


</script>


<style scoped>

  .requestBlock{

    width:100%;

    border-color:black;
    border-style:solid;
    border-width:1px;
    margin-bottom:20px;
    padding-top:10px;
    padding-left:10px;
    padding-right:10px;
    padding-bottom:10px;

  }

  .descriptionOfBlock{

    font-size:18px;
    color:black;
    margin-bottom:20px;
    font-weight:bold;

  }

  .ActionButton{

    font-size:18px;
    color:black;
    margin-bottom:5px;
    font-weight:bold;
    background:gray;
    border-radius:10px;
    cursor:pointer;
    user-select:none;
    text-align:center;
    height:30px;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom:20px;

  }



</style>











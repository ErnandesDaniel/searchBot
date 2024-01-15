<template>

  <div class='objectBlock'>

    <div class='descriptionOfData'>№ ID: {{objectData.id}}</div>

    <div class='descriptionOfData'

      v-if='objectData.name!=null'

    >Название: {{objectData.name}}</div>

    <div class='descriptionOfData'>Просмотрен: {{objectData.viewed}}</div>

    <div class='descriptionOfData'>Цена: {{objectData.price}}</div>

    <div class='descriptionOfData'>Описание: {{objectData.description}}</div>

    <div

      class='descriptionOfData'

      v-if='creationTime!=null'

     >Время выкладывания: {{creationTime}}</div>
    <div

      class='descriptionOfData'

      v-if='creationTime!=null'

     >Время обнаружения: {{detectionTime}}</div>

    <div 

      class='ActionButton' 

      v-on:click='goToSite'

    >Просмотреть на сайте</div> 

    <div 

      class='ActionButton' 

      v-on:click='updateViewed({viewed:false})'


      v-if='objectData.viewed==true'

    >Отметить непросмотренным</div>

    <div 

      class='ActionButton' 

      v-on:click='updateViewed({viewed:true})'

      v-if='objectData.viewed==false'

    >Отметить просмотренным</div>

    <div 

      class='ActionButton' 

      v-on:click='deleteObject'

    >Удалить</div>

  </div>

</template>

<script>

export default{

  data(){

    return{

    }

  },

  props:{

    objectData:Object,

    objectId:Number,

  },

  computed:{

    creationTime(){

      if(this.objectData.creationTime!=null){

        return this.getDateFormat(this.objectData.creationTime);

      }else{

        return null;

      }

    },

    detectionTime(){

      if(this.objectData.detectionTime!=null){

        return this.getDateFormat(this.objectData.detectionTime);

      }else{

        return null;

      }

    },

  },

  methods:{

    getDateFormat(dateString){
      
      var date = new Date(dateString);

      var day=date.getDate();

      var month=date.getMonth();

      month=month+1;

      if(month<10){

        month='0'+month;

      }

      var year=date.getFullYear();

      var formattedTime = `${day}.${month}.${year}`

      return formattedTime;

    },

    updateViewed(stateOfViewed){
      
      //Отправляем сообщение о необходимости сделать блок непросмотренным
      this.$emit('updateViewed', {objectId:this.objectId, viewed:stateOfViewed.viewed});

    },

    deleteObject(){

      //Отправляем сообщение о необходимости удалить блок
      this.$emit('deleteObject', this.objectId);

    },

    goToSite(){


      if(this.$route.params.siteName=='FunPay'){

        window.open(`https://funpay.com/lots/offer?id=${this.objectData.idOnSite}`).focus();

      }else if(this.$route.params.siteName=='Avito'){

        window.open(`https://www.avito.ru${this.objectData.linkOnSite}`).focus();

      }

    },

  }

}


</script>


<style scoped>

  .objectBlock{

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

  .descriptionOfData{

    font-size:18px;
    color:black;
    margin-bottom:20px;
    font-weight:bold;
    word-wrap: break-word;

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











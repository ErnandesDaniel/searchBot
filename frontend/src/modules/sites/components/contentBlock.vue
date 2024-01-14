<template>

  <div class='contentBlock'>

    <div class='nameOfBlock'>{{description}}</div>

    <div 

      class='deleteBlock' 

      v-if='canBeDeleted'

      v-on:click='deleteBlock'


    >Удалить блок</div>

    <input

      v-if='textarea==false'

      :disabled='disabled'

      v-model="newValue"

      @input="changeValue"

      class='dataOfBlock'

      :class='{fieldCanBeChanged:!disabled, emptyError:emptyError}'

    />

    <textarea 

      v-else-if='textarea==true'

      class='dataOfBlock'

      v-model="newValue"

      @input="changeValue"

      :disabled='disabled'

      :class='{fieldCanBeChanged:!disabled}'

    />

  </div>

</template>

<script>

export default{

  data(){

    return{

      oldValue:'',

      newValue:'',

    }

  },


  created(){

    if(this.type=='Number'){

      if(typeof(this.modelValue)=='number'){

        this.newValue=this.modelValue;

        this.oldValue=this.modelValue;

      }else{

        this.newValue='';

        this.oldValue='';

      }

      //Отправляем сообщение для синхронизации данных
      this.$emit('update:modelValue', this.newValue);

    }else{

      //Присваиваем изначальное значение из v-model
      this.newValue=this.modelValue;

    }

  },

  props:{

    description:String,

    type:String,

    modelValue:[String, Number],

    disabled:Boolean,

    textarea:Boolean,

    canBeDeleted:Boolean,

    index:Number,

    emptyError:Boolean,

    canBeEmpty:[Boolean, null],

  },

  watch:{

    modelValue(){

      this.newValue=this.modelValue;

      //Если указано в пропсах, что на объекте ошибка того, что он пустой,
      //но input заполнен текстом, то послать сообщение о том, чтобы 
      //родительский компонент снял ошибку
      if(this.modelValue.length>0 && this.emptyError==true){

        //Отправляем сообщение о необходимости снять ошибку
        this.$emit('removeEmptyError');

      };

    }

  },

  methods:{

    changeValue($event){

      let error=false;

      let response=$event.target.value;

      //Запрещаем использовать множественне пробелы (больше одного)
      response=response.replace(/\s+/g, ' ');

      //Удаляем пробелы с начала строки
      if(response==' ') response='';

      //Записываем исправленную строку в input
      this.newValue=response;

      if (this.type=='Number'){

        response=response.replace('.', '');
        response=response.replace('-', '');
        response=response.replace(/ /g,'');

        //Если у нас идет первым ноль, то мы его удаляем
        if(response[0]=='0')response=response.slice(1);

        this.newValue=response;

        //Если строка не является целым числом
        if(Number.isInteger(Number(response))==false){

          error=true;

          this.newValue=this.oldValue;
          
        }

      }

      //Если все ок, то отправляем данные об изменении
      if(error==false){

        this.oldValue=response;

        //Отправляем сообщение для синхронизации данных
        this.$emit('update:modelValue', response);

      }

    },

    deleteBlock(){

      //Отправляем сообщение о необходимости удалить блок
      this.$emit('deleteBlock', this.index);

    },

  }

}


</script>


<style scoped>

  .contentBlock{

    width:100%;

  }

  .nameOfBlock{

    font-size:18px;
    color:black;
    margin-bottom:5px;
    font-weight:bold;

  }

  .deleteBlock{


    font-size:18px;
    color:black;
    margin-bottom:5px;
    font-weight:bold;
    background:gray;
    border-radius:10px;
    width:140px;
    cursor:pointer;
    user-select:none;
    text-align:center;
    height:30px;
    display:flex;
    justify-content:center;
    align-items:center;

  }




  .dataOfBlock{

    font-size:20px;

    margin-left:auto;
    margin-right:auto;


    width:calc(100% - 20px);
    height:50px;
    background:#D9D9D9;
    border-radius:5px;
    border-color:black;
    border-style:solid;
    border-width:2px;

    font-weight:700;
    line-height:19px;
    display: flex;
    align-items:center;
    padding-left:10px;
    padding-right:10px;
    margin-bottom:20px;

  }

  .dataOfBlock:disabled{

    color:black;

  }

  textarea{

    resize:none;
    width:calc(100% - 20px);
    height:60px;

  }


  .fieldCanBeChanged{

    //text-decoration:underline;

  }

  .emptyError{

    border-color:red;

  }

</style>











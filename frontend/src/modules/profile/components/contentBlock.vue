<template>

  <div class='contentBlock'>

    <div class='nameOfBlock'>{{name}}</div>

    <input

      v-if='textarea==false'

      :disabled='disabled'

      :value="modelValue"

      @input="changeValue"

      class='dataOfBlock'

      :class='{fieldCanBeChanged:!disabled}'

    />

    <textarea 

      v-else-if='textarea==true'

      class='dataOfBlock'

      :value="modelValue"

      @input="changeValue"

      :disabled='disabled'

      :class='{fieldCanBeChanged:!disabled}'

    />


  </div>

</template>

<script>

export default{

  props:{

    name:String,

    modelValue:String,

    disabled:Boolean,

    textarea:Boolean,

  },

  methods:{


    changeValue($event){

      //Отправляем сообщение для синхронизации данных
      this.$emit('update:modelValue', $event.target.value);

    }

  }

}


</script>


<style scoped>

  .contentBlock{

    min-width:200px;
    width:auto;

  }

  .nameOfBlock{

    font-size:12px;
    color:rgba(0,0,0,0.5);
    margin-bottom:2px;

  }



  input, .dataOfBlock{

    font-size:16px;
    margin-bottom:10px;
    width:100%;
    background:white;
    font-weight:100;

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

    text-decoration:underline;

  }

</style>











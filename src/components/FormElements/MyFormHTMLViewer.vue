<template>
  <div>
      <div  v-html="value.value.html" style="height:400px;overflow:scroll" >
      </div>
      <input type="hidden" :id="value.name" :value="value.value" />      
  </div>    
</template>

<script>

//used to display emails for exmaple
//value is html

export default {
  name: 'MyFormHTMLViewer',
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormHTMLViewer',value:{text:'text only', html:'<b>loading...</b>'}, caption:'not set'}
      }
    }
  }    
}

</script>
  
<style scoped>

</style>

<template>
<v-container class="EntityViewer">
      <v-row dense> 
         <v-col cols="12">
            <div class="entityviewerheaderclass">
                 <slot name="entityviewerheader"/>
            </div>
        </v-col>
    </v-row>
   <v-row dense> 
         <v-col cols="12">
            <div class="grid-content">
                 <slot name="entityviewercontent"/>
            </div>
        </v-col>
    </v-row>
 </v-container>   
</template>

<script>

export default {
  name: 'EntityViewer'
}
</script>

<style scoped>

.container{
  padding:0px !important;
}

.EntityViewer{
  height: calc(100vh - 159px);
  width: calc(100vw-1px);
}
.entityviewerheaderclass{
  padding:0px;
}
</style>

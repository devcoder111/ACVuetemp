<template>

  <v-container class="">
    <v-row no-gutters>
      <v-col>

      <v-dialog
        ref="dialogDate"
        v-model="modalDate"
        :return-value.sync="value.value.date"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="value.value.date"
            :label="value==null ? '':value.caption" 
            :name="value==null ? '':value.name" 

            prepend-icon="mdi-calendar"      
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker v-model="value.value.date" scrollable>

          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modalDate = false" >{{$t('common.cancel')}}</v-btn>
          <v-btn text color="primary" @click="$refs.dialogDate.save(value.value.date)">{{$t('common.ok')}}</v-btn>
        </v-date-picker>
      </v-dialog>

      </v-col>
      <v-col cols="4" sm="4" >

      <v-dialog
        ref="dialogTime"
        v-model="modalTime"
        :return-value.sync="value.value.time"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="value.value.time"

            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="modalTime"
          v-model="value.value.time"
          full-width
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modalTime = false">{{$t('common.cancel')}}</v-btn>
          <v-btn text color="primary" @click="$refs.dialogTime.save(value.value.time)">{{$t('common.ok')}}</v-btn>
        </v-time-picker>
      </v-dialog>

      </v-col>
    </v-row>
  </v-container>
         
</template>

<script>


export default {
  name: 'MyFormDateTime',
  data() {  
      return {
         modalDate:false,
         modalTime:false         
      }
  },      
  props:{
    value:{
      type:Object,
      default:function () {
        return {name:'MyFormDateTime',value:{date:new Date().toISOString().substr(0, 10),time:''}, caption:'not set'}
      }
    }
  }  
}

</script>

<style scoped>

</style>
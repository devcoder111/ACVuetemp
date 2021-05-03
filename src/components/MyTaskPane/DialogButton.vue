<template>
  <v-list-item v-if="item.enabled && checkEnabledContext(item)">
  <v-list-item-action>
    <v-btn class="my-2" text tile color="accent" large>
      <v-icon :color="item.color" left>{{item.icon}}</v-icon>{{item.caption}}
    </v-btn>  
  </v-list-item-action>
</v-list-item>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
export default  {
    name:'DialogButton',
    methods:{
      checkEnabledContext(item)
      {
        let res=true;
        //if we are in compose mode we have to check the menu is enabled for that
        if (this.$route.params.container=="inspector")
        {
          if ((item.enabledContext)&&(item.enabledContext.indexOf("compose")==-1))
            res=false;
        }else if (this.$route.params.container=="explorer")
        {
            if ((item.enabledContext)&&(item.enabledContext.indexOf("explorer")==-1))
                        res=false;
        }
        return res;
      },
      openNewDialog(_entity){
        this.$applog('DialogButton - openNewDialog:'+_entity);
        this.$emit('openNewDialog',_entity);
      },
    },
    props:{
      item:{
          type:Object
      }
    }
}
</script>

<style scoped>
.new-button-spacer{
  padding: 10px 10px 10px 10px;
}


</style>
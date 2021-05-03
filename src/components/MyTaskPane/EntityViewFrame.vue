<template>
<div class="EntityViewFrame">

  <iframe :src="getFrameSrc()" width="100%" height="100%" title="" frameBorder="0"></iframe>
 
 </div>

</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
export default  {
    name:'EntityViewFrame',
    props:{
      loading:{
          type: Boolean,
          default: false
      },
      entityDataObject: {
          type:Object
      },
      tabDataObject: {
          type:Object
      },      
      activeTabName:{
          type:String
      },      
    },
    methods:{
      getTab(tab){
          this.$applog('getTab:'+tab);
          for(var i=0;i<this.entityDataObject.screenMetadata.tabs.length;i++){
            var _tab=this.entityDataObject.screenMetadata.tabs[i];
             this.$applog('getTab X:'+_tab.tabName);
            if (_tab.tabName==tab)
            {
              return _tab;
            }
          }
          return null;
      },
      getFrameSrc(){
        let _ourtab=new String(this.activeTabName);
         _ourtab= _ourtab.substr(8);
        var thistab=this.getTab(_ourtab);
        if (thistab==null)
        {
          return "";
        }else{
          this.$applog('getTab tabAction:'+thistab.tabAction);
          if (thistab.component!="EntityViewFrame")
            return "";
        }
        return  thistab.tabAction;
      }
    },
    created(){
      this.$applog('EntityViewFrame created');
      this.$applog(JSON.stringify(this.entityDataObject));
    }
}
</script>

<style scoped>

.EntityViewFrame{
    height: calc(100vh - 159px);
    width: calc(100vw-1px);

    width: 100vw; /** older browsers **/ 
    width: -webkit-calc((100%) - 1px); /** Safari 6, Chrome 19-25 **/
    width: -moz-calc((100%) - 1px); /** FF 4-15  **/

    overflow-y: scroll !important;

    max-height: calc(100vh - 340px) !important;
    min-height: calc(100vh - 340px) !important;      
}

</style>
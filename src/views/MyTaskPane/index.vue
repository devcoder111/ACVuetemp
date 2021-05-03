 <template>
  <LayoutMyTaskPane>
    <template v-slot:header>
      <Tabbar />
    </template>
    <template v-slot:main >
    </template>
    
    <template v-slot:footer >
      
    <navbar />

  </template>

</LayoutMyTaskPane>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'
//vue
import  LayoutMyTaskPane  from '@/layout/indexMyTaskPane'
import Navbar from '@/layout/components/MyTaskPane/Navbar'
import Tabbar from '@/layout/components/MyTaskPane/Tabbar'

//vue page object
export default {
  name: 'mytaskpane',
  components:{
    LayoutMyTaskPane,
    Navbar,
    Tabbar
  },
  data() {
    return {
      brandingObject: {
          type:Object
      }      
    }
  },
  methods:{
  },
  created(){
      this.$applog('myTaskPane created()');
 
  }
}
</script>

<style scoped>

</style>

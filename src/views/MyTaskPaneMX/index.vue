 <template>
   <div class="app-container">
          <v-toolbar>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
          
          </v-toolbar>
           <v-navigation-drawer
      v-model="drawer"
      absolute
      bottom
      temporary
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

          <v-content>
            <breadcrumbs />
            <router-view/>
            <page-footer />
          </v-content>
        </div>
</template>

<script>
// eslint-disable-next-line
import {applog} from '@/services/applog.js'

//vue page object
export default {
  name: 'mytaskpanemx',
   data: () => ({
      drawer: false
    })
}
</script>

<style scoped>

</style>

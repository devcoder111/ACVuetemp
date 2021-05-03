import Vue from 'vue'
import Vuex from 'vuex'
import entityStore from './entityStore.js'
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const namespaced = true

Vue.use(Vuex);
export default new Vuex.Store({
  namespaced,
  state: {
    //layout: 'mobilex-layout', 
    layout: 'accelerator-layout',
    appMode:'AC', //MX or AC
    authStatus: '',
    authToken: null,
    firstrun:false,
    activeConnection: {},
    activeTabName:'',
    selectedConnectionIndex: 0,
    connections: [],
    currentUser: {},
    permissions : {},
    navItems: [],
    toolbarTitle: "",
    dataProvider: {},
    pushNotifications: []
  },
  mutations: {
    SET_LAYOUT (state, payload) {
      state.layout = payload
    },    
    add_connection(state, connection) {     
      //let connectionItem ={title: connection.tabCaption, icon: "mdi-account-box", route: "connection", connection: connection}
      state.connections.push(connection); 
      Storage.set({ key: "connections", value: JSON.stringify(state.connections)});  
    },
    auth_request(state){
      state.authStatus = 'loading'
    },
    auth_success(state, connection) {   
      state.authStatus = 'success'     
      state.authToken = connection.authToken;
      state.currentUser = connection.currentUser.user;
      state.navItems = connection.currentUser.navItems;
      state.permissions = connection.currentUser.permissions;
    },
    auth_error(state){
      state.authStatus = 'error'
    },
    logout(state) {     
      state.authStatus = '';
      state.authToken = null;  
      state.currentUser = {};
      state.navItems = [];    
      
    },
    set_currentUser(state, b) {
      state.currentUser = b;
    },
    set_fcmToken(state, token) {
      state.currentUser.fcmToken = token;
    },
    set_hasMessages(state, b) {
      state.currentUser.hasMessages = b
    },
    update_connection(state, connection, position, tabName) {
      state.activeConnection = connection
      state.connections[position] = connection     
      Storage.set({ key: "activeConnection", value: JSON.stringify(connection)})
      Storage.set({ key: "activeTabName", value: JSON.stringify(tabName)})      
      Storage.set({ key: "connections", value: JSON.stringify(state.connections)})  
    },
    set_activeConnection(state, connection) {
      state.activeConnection = connection;
      state.activeTabName=connection.tabName;
    },
    set_selectedConnectionIndex(state, index) {
      state.selectedConnectionIndex = index;
    },
    add_push_notification(state, pushData) {
      state.pushNotifications.push(pushData)
    },
    remove_push_notification(state, position) {
      state.pushNotifications.splice(position,1);
    },
    init_store(state, data) {   
      const c = data.c;
      const u = data.defaultConnection;
      //this.$applog("init_store", c, u)
      if (c != null)
        state.connections = JSON.parse(c);
      if (u != null) {
        let defaultConnection = JSON.parse(u);
        state.activeConnection = defaultConnection;
        state.activeTabName = defaultConnection.tabName;
        state.authToken = defaultConnection.authToken; 
        state.currentUser = defaultConnection.currentUser.user;  
        state.permissions =  defaultConnection.currentUser.permissions;     
        state.navItems = defaultConnection.currentUser.navItems;
        state.dataProvider = defaultConnection.dataProvider;
      }
    },
    set_toolbarTitle(state, title) {
      state.toolbarTitle = title;
    },
    set_dataProvider(state, provider) {
      state.dataProvider = provider; 
    }
  },
  getters: {
    layout: state => state.layout,
    appMode: state => state.appMode,
    isLoggedIn: state => state.activeConnection != null &&  state.activeConnection.authToken != null,
    authStatus: state => state.authStatus,    
    navItems: state => state.navItems,     
    currentUser(state) {
      if (state.currentUser == null) return {}
      return state.currentUser
    },
    activeConnection: state => state.activeConnection,
    activeTabName: state => state.activeTabName,
    firstrun:state => state.firstrun,
    connections: state => state.connections,
    toolbarTitle: state => state.toolbarTitle,
    fcmToken: state => state.currentUser.fcmToken,
    dataProvider: state => state.dataProvider,
    userPushNotifications: state => state.pushNotifications,
    permissions : state => state.permissions,
    entityPermission: state => param => state.permissions[param] || {}
  },
  actions: {   
    addConnection({commit}, connection) {    
      commit('add_connection', connection);       
    },
    login({commit}, connection, position) { 
      commit('auth_request');
      
      return Storage.set({key: "activeConnection", value: JSON.stringify(connection)}).then(()=> { 
        commit('auth_success', connection);
        commit('update_connection', connection, position);
      });
    },
    logout({commit}, logOutConnection) {    
      logOutConnection.currentUser = {};
      logOutConnection.authToken = null;
      Storage.set({key: "activeTabName", value: ''});
      return Storage.set({key: "activeConnection", value: JSON.stringify(logOutConnection)}).then(()=>{
        commit('logout');
        commit('update_connection', logOutConnection);
      })          
    },
    logoutAll() {
      Storage.remove({key: "activeTabName"});
      return Storage.remove({key: "activeConnection"});
    }
  },
  modules: {
    entityStore: entityStore
  }
})

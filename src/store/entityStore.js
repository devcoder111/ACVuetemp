
// import { Plugins } from '@capacitor/core';
// const { Storage } = Plugins;
// import entityService from '@/services/Providers/dataSageCRMAccelerator'
const namespaced = true


const mutations = {
    selectEntity(payload) { 
        console.log("entityStore", payload);
    }

}
const actions = {
    selectEntity({commit}, payload) {
        console.log("entityStore1", payload);
        // entityService.selectEntity(payload.entity, payload.entityId)
        commit('selectEntity', payload); 
    }
}

export default {
    namespaced,
    // state,
    // getters,
    actions,
    mutations
    }

import Vue from 'vue'
import Vuex from 'vuex'
import db from '../db';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    groups: [],
    todos: [],
  },
  mutations: {
    setGroups(state, data) {
      state.groups = data;
    },
    setTodos(state, data) {
      state.todos = data;
    },
  },
  actions: {
    async fetch({ commit }) {
      const [groups, todos] = await Promise.all([
        db.readGroups(),
        db.readTodos(),
      ]);
      commit('setGroups', groups);
      commit('setTodos', todos);
    },
  },
});

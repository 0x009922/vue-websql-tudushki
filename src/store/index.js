import Vuex from 'vuex'
import Vue from 'vue'
import db from '../db';
import { regEscape } from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    groups: [],
    todos: [],

    filterTodoTitle: null,
    filterTodoDone: null,

    transposingTodoId: null,
  }),
  getters: {
    groupsMap: (state) => (
      Object.fromEntries(
        state.groups.map((item) => [item.id, item]),
      )
    ),
    groupedTodos: (state) => {
      const groups = new Map(
        [null, ...state.groups.map((v) => v.id)].map((v) => [v, []]),
      );

      state.todos.forEach((todo) => {
        const { group_id: id } = todo;

        groups
          .get(groups.has(id) ? id : null)
          .push(todo);
      });

      return [...groups];
    },
    filteredGroupedTodos: (state, getters) => {
      const filters = [];

      if (state.filterTodoTitle) {
        const regPattern = regEscape(state.filterTodoTitle);
        const reg = new RegExp(regPattern, 'i');

        filters.push((todo) => reg.test(todo.title));
      }

      if (state.filterTodoDone !== null) {
        filters.push((todo) => todo.done === state.filterTodoDone);
      }

      if (!filters.length) {
        return getters.groupedTodos;
      }

      console.log(filters);

      return getters.groupedTodos.map(
        ([groupId, todos]) => [
          groupId,
          todos.filter((todo) => filters.every((filter) => filter(todo))),
        ]
      );
    },
    isTransposingTodo: (state) => !!state.transposingTodoId,
    transposingTarget: (state) => state.todos.find((todo) => todo.id === state.transposingTodoId),
  },
  mutations: {
    setData(state, { groups, todos }) {
      state.groups = groups;
      state.todos = todos;
    },
    updateTitleFilter(state, val) {
      state.filterTodoTitle = val;
    },
    updateDoneFilter(state, val) {
      state.filterTodoDone = val;
    },
    resetFilters(state) {
      state.filterTodoDone = null;
      state.filterTodoTitle = null;
    },
    activateTodoTransposing(state, todoId) {
      state.transposingTodoId = todoId;
    },
    clearTodoTransposing(state) {
      state.transposingTodoId = null;
    },
  },
  actions: {
    async fetchData({ commit }) {
      const [groups, todos] = await Promise.all([
        db.groups.readItems(),
        db.todos.readItems(),
      ]);
      commit('setData', { groups, todos });
    },
  },
});

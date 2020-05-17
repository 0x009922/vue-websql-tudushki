import Vuex from 'vuex'
import Vue from 'vue'
import db from '../db';
import { regEscape } from '../utils';

Vue.use(Vuex);

export default new Vuex.Store({
  state: () => ({
    /**
     * Список групп
     * @type {{ id: number, name: string }[]}
     */
    groups: [],
    /**
     * Список todo (тикетов)
     * @type {{ id: number, group_id: number, title: string, description: string, done: boolean }[]}
     */
    todos: [],

    /**
     * Фильтр для отсеивания todo по названию
     */
    filterTodoTitle: null,
    /**
     * Фильтр для отсеивания todo по done
     */
    filterTodoDone: null,

    /**
     * id todo, у которой пользователь нажал "переместить"
     */
    transposingTodoId: null,
  }),
  getters: {
    /**
     * Хэш-карта групп, по id
     */
    groupsMap: (state) => (
      Object.fromEntries(
        state.groups.map((item) => [item.id, item]),
      )
    ),
    /**
     * Сгруппированные todo в формате [[groupId, todos]...]
     * groupId = null - todo вне групп
     */
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
    /**
     * groupedTodos, к которым применены фильтры
     */
    filteredGroupedTodos: (state, getters) => {
      /**
       * Список фильтров
       * @type {Function[]}
       */
      const filters = [];

      // Если есть текст для фильтрации по названию, включаю его
      if (state.filterTodoTitle) {
        // Экранирую пользовательский ввод
        const regPattern = regEscape(state.filterTodoTitle);
        // Создаю регулярку
        const reg = new RegExp(regPattern, 'i');

        // И данная в фильтр todo должна подходить по регулярке 
        filters.push((todo) => reg.test(todo.title));
      }

      if (state.filterTodoDone !== null) {
        // Если фильтр по done != null, то включаю соответствующий фильтр
        filters.push((todo) => todo.done === state.filterTodoDone);
      }

      // Если фильтров нет, возвращаю, как есть
      if (!filters.length) {
        return getters.groupedTodos;
      }

      return getters.groupedTodos.map(
        ([groupId, todos]) => [
          groupId,
          // Фильтрую todo так, чтобы для каждой из них проходили все фильтры
          todos.filter((todo) => filters.every((filter) => filter(todo))),
        ]
      );
    },
    // Активно ли перемещение todo
    isTransposingTodo: (state) => !!state.transposingTodoId,
    // Объект с данными о перемещаемой todo
    transposingTarget: (state) => state.todos.find((todo) => todo.id === state.transposingTodoId),
  },
  mutations: {
    // Установка данных
    setData(state, { groups, todos }) {
      state.groups = groups;
      state.todos = todos;
    },
    // Обновление фильтра по названию
    updateTitleFilter(state, val) {
      state.filterTodoTitle = val;
    },
    // Обновление фильтра по выполнению
    updateDoneFilter(state, val) {
      state.filterTodoDone = val;
    },
    // Сброс фильтров
    resetFilters(state) {
      state.filterTodoDone = null;
      state.filterTodoTitle = null;
    },
    // Активация перемещения todo
    activateTodoTransposing(state, todoId) {
      state.transposingTodoId = todoId;
    },
    // Деактивация перемещения todo
    clearTodoTransposing(state) {
      state.transposingTodoId = null;
    },
  },
  actions: {
    // Загрузка данных из БД
    async fetchData({ commit }) {
      const [groups, todos] = await Promise.all([
        db.groups.readItems(),
        db.todos.readItems(),
      ]);
      commit('setData', { groups, todos });
    },
  },
});

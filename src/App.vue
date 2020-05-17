<template>
  <div class="app">
    <div class="app__title">
      Тудушки
    </div>
    
    <div class="app__actions">
      <button
        @click="addGroup()"
      >
        Добавить группу
      </button>
    </div>

    <filters />

    <board />
  </div>
</template>

<script>
import db from './db';
import Board from './components/Board';
import Filters from './components/Filters';

export default {
  name: 'App',
  components: {
    Board,
    Filters,
  },
  async mounted() {
    // Инициализация БД и первая загрузка данных
    await db.init();
    await this.$store.dispatch('fetchData');
  },
  methods: {
    /**
     * Добавление новой группы
     */
    async addGroup() {
      await db.groups.createItem();
      await this.$store.dispatch('fetchData');
    },
  },
};
</script>

<style lang="sass">
body, html
  margin: 0
  padding: 0

*
  box-sizing: border-box

.app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50

  &__title
    margin: 16px
    font-size: 34px

  &__actions
    margin: 16px
</style>

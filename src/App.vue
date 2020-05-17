<template>
  <div class="app">
    <div class="app__title">
      Тудушки
    </div>
    
    <template v-if="isWebSqlSupported">
      <div class="app__actions">
        <button
          @click="addGroup()"
        >
          Добавить группу
        </button>
      </div>

      <filters />

      <board />
    </template>

    <div
      v-else
      class="app__unsupported"
    >
      <p>
        В вашем браузере приложение работать не может.
        <b>Скорее всего у вас не поддерживается Web SQL.</b>
      </p>
      <p>
        Проверить это, а также узнать, в каких браузерах поддерживается Web SQL,
        можно <a href="https://caniuse.com/#search=web%20sql" target="_blank">здесь</a>.
      </p>
      <p>
        Приходите сюда с поддерживаемым браузером.
      </p>
    </div>
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
  data: () => ({
    isWebSqlSupported: true,
  }),
  async mounted() {
    // Инициализация БД и первая загрузка данных
    try {
      await db.init();
    } catch (err) {
      console.error(err);
      this.isWebSqlSupported = false;
      return;
    }
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

  &__unsupported
    $warning: #FE5F55
    border: 2px solid $warning
    background: lighten($warning, 30)
    margin: 16px
    padding: 4px 16px
    border-radius: 4px
</style>

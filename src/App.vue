<template>
  <div class="app">
    <div class="app__title">
      Тудушки
    </div>
    <board />
  </div>
</template>

<script>
// import { onMounted } from '@vue/composition-api';
// import db from './db';
import Board from './components/Board';

export default {
  name: 'App',
  setup() {
    // onMounted(() => {
    //   await db.init();
    //   this.$store.dispatch('fetch');
    // })
  },
  components: {
    Board
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
  // text-align: center
  color: #2c3e50
  // margin-top: 60px
  &__title
    margin: 16px
    font-size: 20px

</style>

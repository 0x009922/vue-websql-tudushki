<template>
  <div class="filters">
    <div class="filters__title">
      Фильтры

      <span
        v-if="isResetAvailable"
        class="filters__attention"
      >
        активны
      </span>
    </div>

    <div class="filters__label">
      Название карточки
    </div>
    <input
      v-model="title"
      placeholder="Любое название"
    >

    <div class="filters__label">
      Статус выполнения
    </div>
    <select
      v-model="done"
    >
      <option value="none">Любой статус выполнения</option>
      <option :value="false">Не выполнены</option>
      <option :value="true">Выполнены</option>
    </select>

    <button
      :disabled="!isResetAvailable"
      @click="$store.commit('resetFilters')"
    >
      Сброс
    </button>
  </div>
</template>

<script>
import { debounce } from '../utils';

export default {
  name: 'Filters',
  computed: {
    isResetAvailable() {
      return this.title || this.done !== 'none';
    },
    title: {
      get() {
        return this.$store.state.filterTodoTitle;
      },
      set: debounce(function (val) {
        this.$store.commit('updateTitleFilter', val);
      }, 700),
    },
    done: {
      get() {
        const source = this.$store.state.filterTodoDone;
        return source === null
          ? 'none'
          : source;
      },
      set(val) {
        const parsed = val === 'none'
          ? null
          : val;
        this.$store.commit('updateDoneFilter', parsed);
      },
    },
  },
};
</script>

<style lang="sass" scoped>
@keyframes filtersAttentionAnimation
  0%
    opacity: 0
  50%
    opacity: 1
  100%
    opacity: 0

.filters
  margin: 16px
  // border: 1px solid red
  background: darken(white, 5)
  border: 2px dashed lighten(black, 45)
  border-radius: 4px
  // color: white
  padding: 16px
  display: flex
  flex-direction: column
  align-items: start

  &__title
    font-size: 20px
    margin-bottom: 16px

  &__attention
    // margin-left: 16px
    animation: filtersAttentionAnimation 1s infinite ease
    color: #EE6123

  &__label
    font-size: 12px
    color: gray
    margin-bottom: 4px
  
  input + &__label
    margin-top: 8px

  input, select
    width: 100%
    max-width: 300px

  button
    margin-top: 16px
</style>

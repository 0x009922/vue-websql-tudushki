<template>
  <div
    class="ticket"
    :class="{
      'ticket--done': done,
      'ticket--blinking': source.id === transposingTodoId,
    }"
  >
    <div>
      <div
        v-if="!isEditing"
        class="ticket__preview"
      >
        <div class="ticket__preview-check">
          <input
            type="checkbox"
            :checked="done"
          >
        </div>

        <div class="ticket__preview-content">
          <div
            class="ticket__preview-title"
            :class="{ 'text--secondary': !title }"
          >
            {{ title || 'Без названия' }}
          </div>

          <div
            class="ticket__preview-description"
            :class="{ 'text--secondary': !description }"
          >
            {{ description || 'Без описания' }}
          </div>
        </div>
      </div>

      <div
        v-else
        class="ticket__inputs"
      >
        <input
          type="checkbox"
          v-model="done"
        >

        <div class="ticket__title-description">
          <div class="ticket__input-label">
            Название
          </div>
          <input
            v-model="title"
          >

          <div class="ticket__input-label">
            Описание
          </div>
          <textarea
            v-model="description"
          />
        </div>
      </div>
    </div>

    <div class="ticket__actions">
      <template v-if="!isEditing">
        <button @click="isEditing = true">
          Изменить
        </button>

        <button @click="$store.commit('activateTodoTransposing', source.id)">
          Переместить
        </button>

        <button @click="confirmDeletion = true">
          Удалить
        </button>
      </template>

      <template v-else>
        <button
          :disabled="!changes"
          @click="saveChanges()"
        >
          Сохранить
        </button>

        <button
          @click="resetSourceData(), isEditing = false"
        >
          Отмена
        </button>
      </template>
    </div>

    <confirm
      :active="confirmDeletion"
      @confirmed="deleteTodo()"
      @cancelled="confirmDeletion = false"
    >
      Вы действительно хотите удалить карточку?
    </confirm>
  </div>
</template>

<script>
import db from '../db';
import Confirm from './Confirm';
import { mapState } from 'vuex';

/**
 * Карточка, тикет, Todo.
 * Отображение и редактирование.
 */
export default {
  name: 'Ticket',
  components: {
    Confirm,
  },
  props: {
    // Источник данных, todo из хранилища
    source: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // локальный done
      done: null,
      // локальный title
      title: null,
      // локальный description
      description: null,

      // Происходит ли редактирование
      isEditing: false,
      // Подтверждается ли удаление карточки
      confirmDeletion: false,
    };
  },
  computed: {
    ...mapState([
      'transposingTodoId',
    ]),
    // Пак изменений для сохранения
    changes() {
      const entries = [];

      ['title', 'done', 'description'].forEach((prop) => {
        if (this.$data[prop] !== this.source[prop]) {
          entries.push([prop, this.$data[prop]]);
        }
      });

      return entries.length === 0
        ? null
        : Object.fromEntries(entries);
    },
  },
  created() {
    // Установка исходных данных при создании, до монтирования
    this.resetSourceData();
  },
  methods: {
    /**
     * Сброс данных к исходным, сохранённым
     */
    resetSourceData() {
      ['done', 'title', 'description'].forEach((prop) => {
        this.$data[prop] = this.source[prop];
      });
    },
    /**
     * Сохранение изменений в БД
     */
    async saveChanges() {
      await db.todos.updateItem(this.source.id, this.changes);
      this.$store.dispatch('fetchData');
      this.isEditing = false;
    },
    /**
     * Удаление Todo из БД
     */
    async deleteTodo() {
      await db.todos.deleteItem(this.source.id);
      this.$store.dispatch('fetchData');
    },
  },
};
</script>

<style lang="sass" scoped>
.text--secondary
  color: gray

@keyframes ticketBlinking
  0%
    opacity: 0
  50%
    opacity: 1
  100%
    opacity: 0

.ticket
  border: 2px solid black
  border-radius: 4px
  overflow: hidden
  padding: 8px
  background: white

  &--done
    border-color: #1B998B

  &--blinking
    animation: ticketBlinking 1s infinite ease

  &__preview
    display: flex
    &-check
      display: flex
      align-items: center
      justify-content: center
      padding: 8px
      input
        margin: 0
        pointer-events: none
    &-content
      flex-grow: 1
      overflow: hidden
    &-title
      font-size: 14px
    &-description
      font-size: 12px
      color: gray
      white-space: nowrap
      text-overflow: ellipsis
      overflow: hidden
      &:hover
        white-space: normal

  &__inputs
    display: flex
    align-items: flex-start

    input[type="checkbox"]
      margin-top: 18px
    
  &__title-description
    flex-grow: 1
    overflow: hidden
    input, textarea
      width: 100%
      max-width: 100%


  &__input-label
    font-size: 12px
    color: gray

  input + &__input-label
    margin-top: 8px

  &__actions
    border-top: 1px solid gray
    margin-top: 8px
    padding-top: 8px
    display: flex
    button + button
      margin-left: 4px
</style>

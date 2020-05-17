<template>
  <div
    class="board-group"
    :class="{
      'board-group--null': !group,
    }"
  >
    <div class="board-group__name">
      <template v-if="isEditing">
        <div class="board-group__name-input-label">
          Имя группы
        </div>
        <input
          v-model="name"
        >
      </template>
      <template v-else>
        {{ group ? group.name || 'Группа без имени' : 'Карточки вне групп' }}
      </template>

      <div class="board-group__name-actions" v-if="group">
        <template v-if="!isEditing">
          <button @click="isEditing = true">
            Изменить имя группы
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
            @click="name = group.name, isEditing = false"
          >
            Отмена
          </button>
        </template>
      </div>
    </div>

    <div class="board-group__content">
      <slot>
        Здесь пока нет ни одной карточки. Нажмите снизу кнопку
        &laquo;Добавить карточку&raquo;
      </slot>
    </div>

    <div class="board-group__actions">
      <button @click="createTodo()">
        Добавить карточку
      </button>

      <button
        v-if="group"
        @click="confirmDeletion = true"
      >
        Удалить группу
      </button>
    </div>

    <confirm
      :active="confirmDeletion"
      @confirmed="deleteGroup()"
      @cancelled="confirmDeletion = false"
    >
      Вы действительно хотите удалить группу? Карточки из этой группы не будут удалены.
    </confirm>

    <div
      v-if="isTransposingTodo"
      class="board-group__transposing-overlay"
      @click="isTransposingTargetInThisGroup ? clearTodoTransposing() : transposeTodo()"
    >
      <template v-if="isTransposingTargetInThisGroup">
        Оставить здесь
      </template>
      <template v-else>
        Переместить сюда
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import db from '../db';
import Confirm from './Confirm';

export default {
  name: 'BoardGroup',
  components: {
    Confirm,
  },
  props: {
    groupId: Number,
  },
  data: () => ({
    name: null,
    confirmDeletion: false,
    isEditing: false,
  }),
  computed: {
    ...mapGetters([
      'groupsMap',
      'isTransposingTodo',
      'transposingTarget',
    ]),
    group() {
      return this.groupsMap[this.groupId] || null;
    },
    changes() {
      if (this.group && this.group.name !== this.name) {
        return { name: this.name };
      }
      return null;
    },

    isTransposingTargetInThisGroup() {
      const { group_id: id = null } = this.transposingTarget || {};
      return id === this.groupId;
    },
  },
  created() {
    if (this.group) {
      this.name = this.group.name;
    }
  },
  methods: {
    ...mapMutations([
      'clearTodoTransposing',
    ]),
    ...mapActions([
      'fetchData',
    ]),
    async createTodo() {
      await db.todos.createItem({
        group_id: this.groupId,
      });
      await this.fetchData();
    },
    async saveChanges() {
      await db.groups.updateItem(this.groupId, this.changes);
      await this.fetchData();
      this.isEditing = false;
    },
    async deleteGroup() {
      await db.groups.deleteItem(this.groupId);
      await this.fetchData();
    },
    async transposeTodo() {
      await db.todos.updateItem(this.transposingTarget.id, {
        group_id: this.groupId,
      });
      await this.fetchData();
      this.clearTodoTransposing();
    }
  },
};
</script>

<style lang="sass" scoped>
.board-group
  background: #E0E0E0
  padding: 16px
  display: flex
  flex-direction: column
  border-radius: 4px
  max-height: 500px
  position: relative
  overflow: hidden

  &__content
    flex-grow: 1
    overflow: auto

  &--null
    background: darken(white, 5)

  &__name
    font-size: 20px
    margin-bottom: 16px
    display: flex
    flex-direction: column
    align-items: start
    &-input-label
      font-size: 12px
      margin-bottom: 4px
      color: gray
    &-actions
      margin-top: 4px
      display: flex
      button + button
        margin-left: 4px

  &__actions
    margin-top: 16px
    display: flex
    button + button
      margin-left: 4px

  &__transposing-overlay
    position: absolute
    top: 0
    right: 0
    left: 0
    bottom: 0
    display: flex
    align-items: center
    justify-content: center
    text-align: center
    padding: 32px
    background: rgba(0, 0, 0, 0.55)
    color: white
    cursor: pointer
    user-select: none
</style>

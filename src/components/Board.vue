<template>
  <div class="board">
    <group
      v-for="[groupId, todos] in filteredGroupedTodos"
      :key="groupId"
      :group-id="groupId"
    >
      <ticket
        v-for="todo in todos"
        class="board__todo"
        :key="todo.id"
        :source="todo"
      />
    </group>
  </div>
</template>

<script>
import Group from './Group';
import Ticket from './Ticket';
import { mapGetters } from 'vuex';

/**
 * Доска с группами карточек
 */
export default {
  name: 'Board',
  components: {
    Group,
    Ticket,
  },
  computed: {
    ...mapGetters([
      'filteredGroupedTodos',
    ]),
  },
};
</script>

<style lang="sass" scoped>
.board
  display: grid
  padding: 16px
  gap: 16px
  grid-template-columns: repeat(auto-fit, minmax(300px, 400px))

  &__todo + .board__todo
    margin-top: 8px
</style>


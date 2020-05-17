<template>
  <div class="board">
    <!-- {{ groupedTodos }} -->

    <!-- <ul>
      <li
        v-for="(todos, groupId) in groupedTodos"
        :key="groupId"
      >
        {{ groupId || 'null' }} - {{ todos }}
      </li>
    </ul> -->

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
/* eslint-disable vue/no-unused-components */
// import store from '../store';
import Group from './Group';
import Ticket from './Ticket';
import { mapGetters } from 'vuex';

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
  // justify-content: start
  &__todo + .board__todo
    margin-top: 8px
</style>


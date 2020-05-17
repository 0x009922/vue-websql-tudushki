<template>
  <div
    v-if="active"
    class="confirm__overlay"
    @click.self="$emit('cancelled')"
  >
    <div class="confirm__card">
      <div class="confirm__card-title">
        Подтвердите действие
      </div>

      <div class="confirm__card-content">
        <slot />
      </div>

      <div class="confirm__card-actions">
        <button @click="$emit('confirmed')">
          Подтверждаю
        </button>

        <button @click="$emit('cancelled')">
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Компонент-подтверждение действия у пользователя. Работает примерно как стандартный alert
 */
export default {
  name: 'Confirm',
  props: {
    /**
     * Показывать ли подтверждение
     */
    active: Boolean,
  },
};
</script>

<style lang="sass" scoped>
.confirm
  &__overlay
    position: fixed
    z-index: 999
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: rgba(0, 0, 0, 0.25)
    display: flex
    align-items: center
    justify-content: center

  &__card
    background: white
    border-radius: 4px
    width: 450px

    &-title
      font-size: 20px
      padding: 16px
    &-content
      padding: 0 16px
      font-size: 14px
    &-actions
      padding: 16px
      display: flex
      button + button
        margin-left: 4px
</style>

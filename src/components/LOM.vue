<template>
  <aside ref="lom" :class="['lom-component', {'is-alive':alive}]">
    <div class="lom__x">
      <img class="lom__y" src="/images/lom.gif" alt="LOM trap" @mouseenter="captured" />
    </div>

    <p v-if="showHurry" class="hunt-lom is-blinking">HURRY!!! HUNT LOM!!!</p>
  </aside>
</template>

<script setup>
  defineEmits(["captured"]);
</script>

<script>
  export default {
    props: {
      alive: {
        type: Boolean,
        default: false,
      },
      hurry: {
        type: Boolean,
        default: false,
      },
    },

    data() {
      return {}
    },

    watch: {},

    computed: {
      showHurry() {
        return this.alive && this.hurry;
      },
    },

    methods: {
      captured() {
        this.$emit('captured', true);
      }
    },

    mounted() {}
  }
</script>

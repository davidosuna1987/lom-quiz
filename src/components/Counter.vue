<template>
  <aside class="counter-component">
    <div class="counter">
      <span class="counter__success">{{success}}</span>
      {{ '/' }}
      <span class="counter__error">{{error}}</span>
    </div>
  </aside>
</template>

<script setup>
  import { zeroPad } from './../utils';

  import { useAnswersStore } from './../stores/answers';
  const answersStore = useAnswersStore();
</script>

<script>
  export default {
    props: {
      blur: {
        type: Boolean,
        default: false,
      }
    },

    data() {
      return {}
    },

    watch: {},

    computed: {
      success() {
        return this.blur ? '??' : this.answersStore.answers.filter(a => a.success).length;
      },
      error() {
        return this.blur ? '??' : this.answersStore.answers.filter(a => !a.success).length;
      },
    },

    methods: {},

    mounted() {}
  }
</script>
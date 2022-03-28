<template>
  <section class="results-component">
    <Counter />
    <h2 :class="['result is-blinking', resultClass]">{{result}}</h2>
  </section>
</template>

<script setup>
  import { zeroPad } from './../utils';

  import Counter from './Counter.vue';

  import { useAnswersStore } from './../stores/answers';
  const answersStore = useAnswersStore();
</script>

<script>
export default {
  props: {},

    data() {
      return {}
    },

    watch: {},

    computed: {
      success() {
        return this.answersStore.answers.filter(a => a.success).length;
      },
      error() {
        return this.answersStore.answers.filter(a => !a.success).length;
      },
      result() {
        return this.success >= 6 ? 'YOU SAVED THE WORL' : 'YOU LOSE';
      },
      resultClass() {
        return this.success >= 6 ? 'has-text-success' : 'has-text-danger';
      },
    },

    methods: {},

    mounted() {}
}
</script>
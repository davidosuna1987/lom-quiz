<template>
  <button v-if="!started" class="lom-button prologue-play-button" @click="startGame">PLAY</button>
  <div v-else>
    <Prologue v-if="view === 'prologue'" @completed="prologueCompleted" />
    <Quiz v-if="view === 'quiz'" :questions="questions" @completed="quizCompleted" />
    <Results v-if="view === 'results'" />
  </div>

  <audio ref="soundtrack" src="/sounds/soundtrack.mp3"></audio>
</template>

<script setup>
  import Prologue from './components/Prologue.vue';
  import Quiz from './components/Quiz.vue';
  import Results from './components/Results.vue';
  import { questions } from './bbdd/questions';
</script>

<script>
export default {
  props: {},

    data() {
      return {
        started: false,
        view: 'prologue',
      }
    },

    watch: {},

    computed: {},

    methods: {
      startGame() {
        this.$refs.soundtrack.play();
        this.started = true;
      },
      prologueCompleted() {
        this.view = 'quiz';
      },
      quizCompleted() {
        this.view = 'results';
      },
    },

    mounted() {}
}
</script>
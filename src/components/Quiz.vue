<template>
  <section :class="['quiz-component', {'lom-alive':lomAlive, 'is-grayscale':grayscale}]">
    <template v-for="question, index in questions" :key="question.id">
      <Question v-show="showing(question)" :question="question" :index="index" :showing="showing(question)" @answer="answer" @lom-alive="lomAlive = $event" />
    </template>

    <nav class="question-nav">
      <button ref="prev" class="question-nav__item is-prev" :class="{'is-disabled':prevDisabled}" @click.prevent="prev">PREV</button>
      <button v-if="showingLastQuestion" ref="finish" class="question-nav__item is-next is-finish" :class="{'is-disabled':!quizFinished}" @click.prevent="finish">FINISH</button>
      <button v-else ref="next" class="question-nav__item is-next" :class="{'is-disabled':nextDisabled}" @click.prevent="next">NEXT</button>
    </nav>

    <Counter :blur="blurCounter" />

    <audio ref="success" src="/sounds/success.mp3"></audio>
    <audio ref="error" src="/sounds/error.mp3"></audio>
  </section>
</template>

<script setup>
  import { zeroPad } from './../utils';
  import Question from './Question.vue';
  import Counter from './Counter.vue';

  import { useAnswersStore } from './../stores/answers';
  const answersStore = useAnswersStore();
</script>

<script>
  export default {
    props: {
      questions: {
        type: Array,
        required: true,
      },
    },

    data() {
      return {
        show: false,
        current: 0,
        lomAlive: false,
      }
    },

    watch: {},

    computed: {
      currentQuestion() {
        return this.questions[this.current];
      },
      prevDisabled() {
        return this.current === 0 ||
          this.current === this.answersStore.answers.length;
      },
      nextDisabled() {
        return this.current === this.questions.length - 1 ||
          this.current === this.answersStore.answers.length;
      },
      blurCounter() {
        return this.currentQuestion.trick === 'index' && this.current === this.answersStore.answers.length ? true : false;
      },
      grayscale() {
        if(this.currentQuestion.trick?.includes('grayscale')){
         console.info(this.answersStore.answers.length, this.questions.map(q => q.id).indexOf(this.currentQuestion.id))
        }
        return this.currentQuestion.trick?.includes('grayscale') && this.answersStore.answers.length < this.questions.map(q => q.id).indexOf(this.currentQuestion.id)+1;
      },
      quizFinished() {
        return this.answersStore.answers.length === this.questions.length;
      },
      showingLastQuestion() {
        return this.current === this.questions.length - 1;
      },
    },

    methods: {
      answer(answer, timeout = false) {
        this.answersStore.addAnswer(answer);
        let sound = answer.success ? 'success' : 'error';
        this.$refs[sound]?.play();
        this.$refs.next?.focus();
        this.$refs.fihish?.focus();
      },
      prev() {
        this.$refs.prev.blur();
        if(this.current === 0) return;
        this.current --;
      },
      next() {
        this.$refs.next.blur();
        if(this.current === this.questions.length - 1) return;
        this.current ++;
      },
      finish() {
        this.$emit('completed', true);
      },
      showing(question) {
        return this.currentQuestion.id === question.id;
      }
    },

    mounted() {}
  }
</script>

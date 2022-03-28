<template>
  <article :class="['question-component', {'is-blurred':blurred}]">
    <section :class="['question__wrapper', {'is-blinking':blinking}]">
      <p class="question" v-html="`${questionIndex}${question.question}`"></p>

      <div v-if="['checkbox', 'colors'].includes(question.type)" class="options">
        <div v-for="option, key in question.options" :key="option" class="option">
          <label class="checkbox__container"
            :class="[checkboxClass(key), {'pointer-events-none':this.answer}]"
            @click.prevent="checkboxAnswer($event, key)">
            <input class="checkbox__default" type="checkbox" :checked="checkboxChecked(key)">
            <span class="checkbox__custom"></span>
            <span :class="['checkbox__label', colorClass(option)]">{{ucf(option)}}</span>
          </label>
        </div>
      </div>

      <div v-if="question.type.includes('input') " class="input">
        <div :class="['input__wrapper', inputColor, {'is-timeout':timeout}]">
          <input ref="input" :type="question.type.split('.').pop()" class="input__field" @keydown="checkSubmitInput">
          <button ref="inputButton" class="input__button" @click.prevent="inputAnswer">SUBMIT</button>
        </div>
        <div v-if="showCorrect" class="correct_answer">Correct answer: {{question.correct}}</div>
      </div>

      <div v-if="question.type === 'select'" ref="select" :class="['select', selectClass]" tabindex="-1" @keydown="selectKeydown">
        <div class="select__wrapper">
          <header class="select__header">
            <span v-if="answer" class="select__selected">{{value}}</span>
            <span v-else class="select__placeholder">Select an option</span>
          </header>
          <div class="select__options">
            <div v-for="option, key in question.options" :key="option" class="select__option" @click.prevent="selectOption(key, option)" tabindex="-1">{{option}}</div>
          </div>
        </div>
        <div v-if="showCorrect" class="correct_answer">Correct answer: {{selectCorrect}}</div>
      </div>
    </section>

    <Countdown v-if="showing && !finished" ref="countdown" :sec="countdownSeconds" @timeout="isTimeout" @hurry="hurry = true" />

    <LOM ref="lom" :alive="lomAlive" @captured="lomCaptured" :hurry="hurryLom"/>
  </article>
</template>

<script setup>
  import { ucf } from './../utils';
  import Countdown from './Countdown.vue';
  import LOM from './LOM.vue';
</script>

<script>
  export default {
    props: {
      question: {
        type: Object,
        required: true,
      },
      showing: {
        type: Boolean,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
    },

    data() {
      return {
        answer: null,
        value: null,
        blocked: false,
        finished: false,
        hurry: false,
        timeout: false,
      }
    },

    watch: {
      showing: {
        inmediate: true,
        handler(val) {
          if(val === true){
            if(!this.answer) setTimeout(() => this.focusInput(), 50);
            if(this.$refs.countdown) setTimeout(() => this.$refs.countdown.init(), 10);
            this.$emit('lomAlive', this.lomAlive);
          }
        }
      },
    },

    computed: {
      success() {
        if(!this.answer) return null;
        return this.answer && this.answer === this.question.correct;
      },
      showCorrect() {
        return this.success === false || this.timeout;
      },
      inputColor() {
        let type = this.question.type.split('.').pop() === 'text' ? 'string' : 'number';
        if(!this.finished || (this.answer !== null && typeof this.answer !== type)) return null;
        return this.success ? 'is-success' : 'is-error';
      },
      selectClass() {
        if(typeof this.answer !== 'string') return null;
        return this.success ? 'is-success' : 'is-error';
      },
      countdownSeconds() {
        return this.question.seconds;
      },
      lomAlive() {
        return this.trick('lom') && this.blocked;
      },
      hurryLom() {
        return this.hurry && !this.finished;
      },
      blinking() {
        return this.trick('blink') && !this.finished;
      },
      questionIndex() {
        if(this.trick('index')) return '';
        return `<span class="question__index">${this.index+1}.- </span>`
      },
      selectCorrect() {
        if(this.trick('index')) return this.index+1;
        return this.question.options[this.question.correct];
      },
      blurred() {
        return this.trick('blur') && !this.finished;
      },
    },

    methods: {
      init() {
        this.checkLomAlive();
      },
      trick(trick) {
        return this.question.trick?.includes(trick);
      },
      checkLomAlive() {
        if(this.trick('lom')) this.blocked = true;
      },
      focusInput() {
        if(this.question.type.includes('input') && !this.timeout) this.$refs.input.focus();
        if(this.question.type.includes('select') && !this.timeout) this.$refs.select.focus();
      },
      emitAnswer() {
        this.finished = true;
        this.$emit('answer', { id:this.question.id, success:this.success });
      },
      checkboxAnswer(event, key) {
        if(this.answer) return;
        this.answer = key;
        this.emitAnswer()
      },
      checkboxChecked(key) {
        if(!this.answer) return false;
        return this.answer === key || key === this.question.correct;
      },
      checkboxClass(key) {
        if(!this.answer) return false;
        if(this.answer !== key && this.question.correct !== key) return false;
        return key === this.question.correct ? 'is-success' : 'is-error';
      },
      inputAnswer(event) {
        let type = this.question.type.split('.').pop();
        if(type === 'number') this.inputNumberAnswer(event);
        if(type === 'text') this.inputStringAnswer(event);
      },
      inputNumberAnswer(event) {
        if(typeof this.answer === 'number') return;
        let value = event.target.previousElementSibling.value;
        if(!value.length) return;
        this.answer = parseInt(value);
        this.emitAnswer()
      },
      inputStringAnswer(event) {
        if(typeof this.answer === 'string') return;
        let value = event.target.previousElementSibling.value;
        if(!value.length) return;
        this.answer = value;
        this.emitAnswer()
      },
      checkSubmitInput(event) {
        if(event.keyCode === 13){
          event.preventDefault();
          this.$refs.inputButton.click();
          this.$refs.inputButton.blur();
        }
      },
      selectOption(key, value) {
        if(this.answer) return;
        this.answer = key;
        if(this.trick('index') && parseInt(value) === this.index+1) this.answer = this.question.correct;
        this.value = value;
        this.emitAnswer()
      },
      selectKeydown(event) {
        if(event.keyCode === 13) event.target.classList.toggle('is-opened');
      },
      colorClass(color) {
        if(!color || this.answer || (this.question.type !== 'colors' && !this.trick('colors'))) return null;
        if(color === 'red') return 'is-primary';
        if(color === 'yellow' || color === 'brown') return 'is-danger';
        if(color === 'blue' || color === 'purple') return 'is-secondary';
      },
      isTimeout() {
        this.timeout = true;
        if(this.question.type === 'input.number'){
          this.answer = null;
          this.$refs.input.value = null;
          this.$refs.input.blur();
        }
        if(this.question.type === 'input.text'){
          this.answer = null;
          this.$refs.input.value = null;
          this.$refs.input.blur();
        }
        if(this.question.type === 'select'){
          this.answer = 'z';
          this.value = 'Timeout';
        }
        if(this.question.type === 'colors'){
          this.answer = this.question.options.correct === 'a' ? 'b' : 'a';
          this.question.options[this.answer] = 'Timeout';
        }
        if(this.question.type === 'checkbox'){
          this.answer = this.question.options.correct === 'a' ? 'b' : 'a';
          this.question.options[this.answer] = 'Timeout';
        }
        if(this.trick('lom')) this.lomCaptured();
        this.emitAnswer();
      },
      lomCaptured() {
        this.blocked = false;
        this.$emit('lomAlive', false);
      },
    },

    mounted() {
      this.init();
    }
  }
</script>
<template>
  <aside ref="counter" :class="['countdown-component', colorClass]" @click="start()"></aside>
  <audio ref="countdown" src="/sounds/countdown.mp3"></audio>
</template>

<script setup>
  defineEmits(['timeout', 'hurry']);
</script>

<script>
  export default {
    props: {
      sec: {
        type: Number,
        default: 10,
      },
      colors: {
        type: Boolean,
        default: true,
      }
    },

    data() {
      return {
        elem: null,
        seconds: null,
        totalTime: null,
        usedTime: 0,
        startTime: null,
        timer: null,
        timeout: false,
      }
    },

    watch: {
      usedTime: {
        inmediate: true,
        handler(ms) {
          let usedSeconds = ms / 100;

          if(usedSeconds === this.sec - 4){
            this.$refs.countdown.play();
          }
          if(usedSeconds === this.sec){
            this.timeout = true;
            this.$emit('timeout', this.timeout);
          }

          if(this.sec - usedSeconds === 10){
            this.$emit('hurry', true);
          }
        }
      }
    },

    computed: {
      colorClass() {
        if(!this.colors || this.timeout) return null;
        if(this.sec - this.usedSeconds < 2) return 'is-danger';
        if(this.sec - this.usedSeconds < 5) return 'is-warning';
        return 'is-success';
      },
      usedSeconds() {
        return this.usedTime / 100;
      },
    },

    methods: {
      init(){
        this.reset();
        this.elem = this.$refs.counter;
        this.seconds = this.sec;
        this.totalTime = this.seconds * 100;
        this.startTime = +new Date();
        this.start();
      },
      count() {
        this.usedTime = Math.floor((+new Date() - this.startTime) / 10);

        var tt = this.totalTime - this.usedTime;
        if(tt <= 0) {
          this.elem.innerHTML = 'TIMEOUT';
          clearInterval(this.timer);
        } else {
          var mi = Math.floor(tt / (60 * 100));
          var ss = Math.floor((tt - mi * 60 * 100) / 100);
          var ms = tt - Math.floor(tt / 100) * 100;

          this.elem.innerHTML = this.fillZero(ss) + "." + this.fillZero(ms);
        }
      },
      start() {
        if(!this.timer){
          this.timer = setInterval(function() {
            this.count()
          }.bind(this), 1);
        }
      },
      stop() {
        if (this.timer) clearInterval(this.timer);
      },
      reset() {
        if(this.timer){
          clearInterval(this.timer);
          this.elem.innerHTML = '00.00';
          this.totalTime = this.sec * 100;
          this.usedTime = 0;
          this.startTime = +new Date();
          this.timer = null;
        }
      },
      fillZero(num) {
        return num < 10 ? '0' + num : num;
      },
    },

    mounted() {
      this.init();
    }
  }
</script>

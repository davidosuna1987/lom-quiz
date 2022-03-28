<template>
  <section class="prologue-component">
    <div id="typing"></div>
    <button v-if="showStartButton" class="lom-button prologue-start-button" @click="$emit('completed', true)">START</button>
  </section>
</template>

<script>
  export default {
    props: {},

    data() {
      return {
        showPlayButton: true,
        showStartButton: false,
      }
    },

    watch: {},

    computed: {},

    methods: {
      init(){
        let vue = this;

        let instance = new TypeIt("#typing", { speed: 50, startDelay: 900, cursorSpeed: 500 })
                    .type("<span class='typing-span'>Many years ago,</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> the world became dominated by machines after the most ferocious war humanity had ever seen.</span>", {speed: 100, delay: 1500})
                    .type("<br><br><span class='typing-span'>Right now,</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> you are one of the few humans who stays alive,</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> and the leader of the machines</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> (a.k.a. LOM)</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> brings you the opportunity to travel back in time to the moment when everything changed.</span>", {speed: 100, delay: 1500})
                    .type("<br><br><span class='typing-span'>To save the world,</span>", {speed: 100, delay: 500})
                    .type("<span class='typing-span'> you must answer correctly at least 6 of 10 questions,</span>", {speed: 100, delay: 750})
                    .type("<span class='typing-span'> but...</span>", {speed: 100, delay: 1500})
                    .type("<span class='typing-span'> be careful with the traps that LOM has prepared for you.</span>", {speed: 100, delay: 1500})
                    .go();

        let interval = setInterval(() => {
          if(instance.is('completed')){
            instance.destroy();
            vue.showStartButton = true;
            clearInterval(interval);
          }
        }, 200);
      },
    },

    mounted() {
      this.init();
    }
  }
</script>

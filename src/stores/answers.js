import { defineStore } from 'pinia';

export const useAnswersStore = defineStore('answers', {

  state: () => ({
    answers: [],
  }),


  actions: {
    addAnswer(answer) {
      this.answers.push(answer);
    },
  },

})
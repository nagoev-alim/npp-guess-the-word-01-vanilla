import words from '../data/mock.js';

/**
 * @class App
 */
export default class App {
  constructor(root) {
    this.root = root;
    this.words = words;
    this.word = null;
    this.maxGuesses = null;
    this.incorrectLetters = [];
    this.correctLetters = [];

    this.root.innerHTML = `
      <h3 class='title'>Guess the Word</h3>
      <div class='content'>
        <input type='text' maxlength='1' class='visually-hidden' data-input=''>
        <div class='inputs' data-inputs=''></div>
        <div class='details'>
          <p class='hint'>Hint: <span data-hint=''></span></p>
          <p class='guess-left'>Remaining guesses: <span data-left=''></span></p>
          <p class='wrong-letter'>Wrong letters: <span data-wrong=''></span></p>
        </div>
        <button data-reset=''>Reset Game</button>
      </div>
    `;

    this.DOM = {
      input: document.querySelector('[data-input]'),
      inputs: document.querySelector('[data-inputs]'),
      hint: document.querySelector('[data-hint]'),
      left: document.querySelector('[data-left]'),
      wrong: document.querySelector('[data-wrong]'),
      btnReset: document.querySelector('[data-reset]'),
    };

    this.randomWord();

    this.DOM.btnReset.addEventListener('click', this.randomWord);
    this.DOM.input.addEventListener('input', this.initGame);
    this.DOM.inputs.addEventListener('click', () => this.DOM.input.focus());
    document.addEventListener('keydown', () => this.DOM.input.focus());
  }

  /**
   * @function
   */
  randomWord = () => {
    const { word, hint } = this.words[Math.floor(Math.random() * this.words.length)];
    console.log({ word, hint });
    this.word = word
    this.maxGuesses = this.word.length >= 5 ? 8 : 6;
    this.correctLetters = [];
    this.incorrectLetters = [];
    this.DOM.hint.innerText = hint;
    this.DOM.left.innerText = this.maxGuesses;
    this.DOM.wrong.innerText = this.incorrectLetters;

    let html = '';
    for (let i = 0; i < this.word.length; i++) {
      html += `<input type='text' disabled>`;
      this.DOM.inputs.innerHTML = html;
    }
  };

  initGame = ({ target: { value } }) => {
    const key = value.toLowerCase();
    if (key.match(/^[A-Za-z]+$/) && !this.incorrectLetters.includes(` ${key}`) && !this.correctLetters.includes(key)) {
      if (this.word.includes(key)) {
        for (let i = 0; i < this.word.length; i++) {
          if (this.word[i] === key) {
            this.correctLetters += key;
            this.DOM.inputs.querySelectorAll('input')[i].value = key;
          }
        }
      } else {
        this.maxGuesses--;
        this.incorrectLetters.push(` ${key}`);
      }
      this.DOM.left.innerText = this.maxGuesses;
      this.DOM.wrong.innerText = this.incorrectLetters;
    }
    this.DOM.input.value = '';

    setTimeout(() => {
      if (this.correctLetters.length === this.word.length) {
        alert(`Congrats! You found the word ${this.word.toUpperCase()}`);
        return this.randomWord();
      } else if (this.maxGuesses < 1) {
        alert('Game over! You don\'t have remaining guesses');
        for (let i = 0; i < this.word.length; i++) {
          this.DOM.inputs.querySelectorAll('input')[i].value = this.word[i];
        }
      }
    }, 100);
  };
}

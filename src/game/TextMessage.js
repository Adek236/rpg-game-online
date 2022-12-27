import { KeyPressListener } from "./KeyPressListener.js";

export class TextMessage {
  constructor({ text, onComplete }) {
    this.text = text;
    this.onComplete = onComplete;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("text-message");

    this.element.innerHTML = `
        <p class="text-message_p">${this.text}<p>
        <button class="text-message_button">Next</button>
        `;

    this.element.querySelector("button").addEventListener("click", () => {
      // Close the text message
      this.done();
    });

    this.actionListener = new KeyPressListener("Enter", () => {
        this.actionListener.unbind();
        this.done();
        
    })
  }

  done() {
    this.element.remove();
    this.onComplete();
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);
  }
}

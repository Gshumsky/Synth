import * as Tone from "tone";
import "./instruments/lead";

const startMusic = async () => {
  await Tone.start();
  console.log("Audio context started");
  const transport = Tone.getTransport();
  transport.start();
};

console.log("JavaScript is running");
window.onload = () => {
  const startButton = document.createElement("button");
  startButton.innerText = "Start Music";
  startButton.addEventListener("click", startMusic);
  document.body.appendChild(startButton);
};

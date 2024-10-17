import * as Tone from "tone";


// Type definition for note objects
interface Note {
    time: string;
    note: string;
    duration: string;
}

// Create a Synth for the melody
const melodySynth = new Tone.Synth({
    oscillator: {
        type: 'sine'
    },
    envelope: {
        attack: 0.1,
        decay: 0.3,
        sustain: 0.4,
        release: 0.8
    }
}).toDestination();

// Create a Synth for the bass
const bassSynth = new Tone.Synth({
    oscillator: {
        type: 'triangle'
    },
    envelope: {
        attack: 0.2,
        decay: 0.4,
        sustain: 0.5,
        release: 1
    }
}).toDestination();

// Melody sequence
const melodyNotes: Note[] = [
    { time: "0:0:0", note: "C4", duration: "8n" },
    { time: "0:0:2", note: "E4", duration: "8n" },
    { time: "0:1:0", note: "G4", duration: "8n" },
    { time: "0:1:2", note: "B4", duration: "8n" },
    { time: "0:2:0", note: "C5", duration: "8n" },
    { time: "0:2:2", note: "B4", duration: "8n" },
    { time: "0:3:0", note: "G4", duration: "8n" },
    { time: "0:3:2", note: "E4", duration: "8n" }
];

// Create Tone.Part for the melody
const melodyPart = new Tone.Part((time, note) => {
    melodySynth.triggerAttackRelease(note.note, note.duration, time);
}, melodyNotes as any).start(0);

// Bass sequence
const bassNotes: Note[] = [
    { time: "0:0:0", note: "C2", duration: "4n" },
    { time: "0:2:0", note: "G2", duration: "4n" },
    { time: "1:0:0", note: "A2", duration: "4n" },
    { time: "1:2:0", note: "F2", duration: "4n" }
];

// Create Tone.Part for the bass
const bassPart = new Tone.Part((time, note) => {
    bassSynth.triggerAttackRelease(note.note, note.duration, time);
}, bassNotes as any).start(0);

// Set the tempo
Tone.Transport.bpm.value = 120;

// Function to start the transport and audio context
const startMusic = async () => {
    await Tone.start();
    console.log('Audio context started');
    Tone.Transport.start();
};

console.log('JavaScript is running');
// Button to start the music
window.onload = () => {
const startButton = document.createElement('button');
startButton.innerText = 'Start Music';
startButton.addEventListener('click', startMusic);
document.body.appendChild(startButton);}


import * as Tone from "tone";
import { Note } from "./types";
import { getRandomItem } from "./utils";


export class BaseInstrument{
    private gain: any;
    private melodySynth: any;
    private melodyPart: any;
    private reverb: any;
    private delay: any;
    constructor(){
        this.gain = new Tone.Gain(0.2).toDestination();
        this.reverb = new Tone.Reverb({
            decay: 2.5,    // Time in seconds the reverb lasts
            preDelay: 0.01, // Time in seconds before the reverb starts
            wet: 0.8       // Mix level of the reverb (0 to 1)
        }).toDestination();
        this.delay = new Tone.FeedbackDelay({
            delayTime: "8n",  // Delay time (8th note)
            feedback: 0.5,    // Feedback amount (0 to 1)
            wet: 0.5          // Mix level of the delay (0 to 1)
        }).toDestination(); // Connects delay to the audio output

        this.melodySynth = new Tone.Synth({
            oscillator: {
                type: 'sine'
            },
            envelope: {
                attack: 0.1,
                decay: 0.3,
                sustain: 0.4,
                release: 0.7
            }
        }).connect(this.gain);
        this.gain.connect(this.delay).connect(this.reverb)

        this.melodyPart = new Tone.Part((time, note) => {
            this.melodySynth.triggerAttackRelease(note.note, note.duration, time);
        }, [] as any).start(0);
        
        this.melodyPart.loop = true;
        this.melodyPart.loopEnd = "1m";
        Tone.Transport.bpm.value = 120;
    }

private getRandomNote = (notes: (string|null)[],
     time: string, duration:string)=>{
    return {
                time: time,
                note: getRandomItem(notes),
                duration: duration
    }
}

private generateRandomMelody = (notes: (string|null)[])=>{
    let newMelody: Note[] = [];
    let quarter = 0
    for (quarter; quarter < 5;) {
        let currentTime = `0:${quarter}`
        const duration = getRandomItem(["4n","8n","16n"])
        newMelody.push(
            this.getRandomNote(notes, currentTime, duration),
        );
        switch (duration){
            case "4n":
                quarter++
                break;
            case "8n":
                quarter+=0.5
                break;
            case "16n":
                quarter+=0.25
                break;
        }
    }
    return newMelody;
}

private updateMelody = ()=>{
    const newMelodyNotes = this.generateRandomMelody(["C4", "D4", "E4", "G4", "A4", null]);
    console.log(newMelodyNotes)
    this.melodyPart.clear();
    newMelodyNotes.forEach(note => {
        this.melodyPart.add(note);
    });
}

public randomizeMelody = ()=>{
    Tone.Transport.scheduleRepeat(() => {
    this.updateMelody();
}, "1m");
}
}

export default Tone;
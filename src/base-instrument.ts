import * as Tone from "tone";
import { Note } from "./types";
import { getRandomItem } from "./utils";
import { EIGHTH, ONE_MEASURE, QUARTER, SIXTEENTH } from "./constants";


export class BaseInstrument{
    private gain: any;
    private melodySynth: any;
    private melodyPart: any;
    constructor(){
        this.gain = new Tone.Gain(0.2).toDestination();

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

        this.melodyPart = new Tone.Part((time, note) => {
            this.melodySynth.triggerAttackRelease(note.note, note.duration, time);
        }, [] as any).start(0);
        
        this.melodyPart.loop = true;
        this.melodyPart.loopEnd = ONE_MEASURE;
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
    for (let quarter = 0; quarter < 5;) {
        let currentTime = `0:${quarter}`
        const duration = getRandomItem([QUARTER,EIGHTH,SIXTEENTH])
        newMelody.push(
            this.getRandomNote(notes, currentTime, duration),
        );
        switch (duration){
            case QUARTER:
                quarter++
                break;
            case EIGHTH:
                quarter+=0.5
                break;
            case SIXTEENTH:
                quarter+=0.25
                break;
        }
    }
    return newMelody;
}

private updateMelody = (barsList: any)=>{
    (this.updateMelody as any).counter = (this.updateMelody as any).counter || 0
    const newMelodyNotes = barsList[(this.updateMelody as any).counter];
    this.melodyPart.clear();
    newMelodyNotes.forEach((note: any) => {
        this.melodyPart.add(note);
    });
    (this.updateMelody as any).counter = ((this.updateMelody as any).counter>=barsList.length-1)?0:((this.updateMelody as any).counter) + 1;

}

//[new, use1, new, use3]
public constructMelody = (barTypes: string[])=>{
    let barsList: any = []
    barTypes.forEach(
        (instruction: string)=>{
            const bar = (instruction == "new")?this.generateRandomMelody(["C4", "D4", "E4", "G4", "A4", null]):barsList[Number(instruction.slice(-1))-1]
            barsList.push(bar)
        }, []
    )
    Tone.Transport.scheduleRepeat(() => {
        console.log(barsList)
    this.updateMelody(barsList);
}, ONE_MEASURE, '3');
}
}

export default Tone;
import fs from 'fs'
import promptSync from 'prompt-sync';
const prompt = promptSync();
import chalk from 'chalk';


function randomBlockGenerator(n) {
    const colors = ["RED", "BLUE", "GREEN", "YELLOW"];
    const result = [];
    for (let i = 0; i < n; i++) {
        const randomIndex1 = Math.floor(Math.random() * colors.length);
        const randomColor1 = colors[randomIndex1];
        const randomIndex2 = Math.floor(Math.random() * colors.length);
        const randomColor2 = colors[randomIndex2];
        result.push({
            content: randomColor1,
            color: randomColor2
        });
    }

    return result;
}

const blocks = randomBlockGenerator(5);
let patient = {}
let individualTimes = []
let totaltime = 0;
let correct = 0;
let totalquestions = blocks.length
let incorrect = 0;

function getColoredBlock(content, color){
    if(color === 'RED'){
        return chalk.red(content)
    }

    if(color === 'BLUE'){
        return chalk.blue(content)
    }

    if(color === 'GREEN'){
        return chalk.green(content)
    }

    if(color === 'YELLOW'){
        return chalk.yellow(content)
    }
}

function printOneBlock(content, color){
    console.log(getColoredBlock(content , color));
    let starttime = Date.now();
    let ans = prompt('r / b / g / y -> ');
    while(!(ans === 'r' || ans === 'b' || ans === 'g' || ans === 'y')){
        console.log("INVALID, SELECT FROM THE GIVEN RANGE");
        console.log(getColoredBlock(content , color));
        ans = prompt('r / b / g / y -> ');
        
        if((ans === 'r' || ans === 'b' || ans === 'g' || ans === 'y')){
            break;
        }
    }
    let endtime = Date.now();
    totaltime += (endtime - starttime) / 1000
    individualTimes.push((endtime - starttime) / 1000)
    
    if(ans === 'r') return "RED"
    if(ans === 'b') return "BLUE"
    if(ans === 'g') return "GREEN"
    if(ans === 'y') return "YELLOW"
}


async function start(){
    const name = prompt('Enter Your Name -> '); 
    const age = prompt('Enter Your Age -> ');
    

    for(let i=0; i<blocks.length; i++){
        let userans = printOneBlock(blocks[i].content , blocks[i].color);
        blocks[i].userans = userans
        if(userans === blocks[i].color){
            correct++;
        }
        else{
            incorrect++;
        }
    }

    for(let i=0; i<individualTimes.length; i++){
        console.log("for question " , (i  + 1) , " -> ", individualTimes[i] , " secs");
    }
    console.log("total time -> " , totaltime , " secs");

    patient.name = name;
    patient.age = age;
    patient.testdate = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata'
    })
    patient.questions = blocks;
    patient.individualTimes = individualTimes
    patient.totaltime = totaltime;
    patient.correct = correct
    patient.incorrect = incorrect
    patient.totalques = totalquestions


    // write logic for congruent and incongruent also
    let congruentques = 0;
    let congruenttime = 0;

    let incongruentques = 0;
    let incongruenttime = 0;

    for(let i=0; i<blocks.length; i++){
        if(blocks[i].color === blocks[i].content){
            congruenttime += individualTimes[i]
            congruentques++;
        }
        else{
            incongruentques++;
            incongruenttime += individualTimes[i]
        }
    }

    patient.avgCongruenttime = (congruenttime / congruentques)
    patient.avgInCongruenttime = (incongruenttime / incongruentques)

    console.log(patient);

    // send this patient data to a google sheet
    let patientJsonString = JSON.stringify(patient)
    await fs.appendFileSync('output.txt' , patientJsonString + "\n")
}

start()
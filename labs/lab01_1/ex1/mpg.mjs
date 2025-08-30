import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

const milesDriven = parseFloat(await rl.question('Miles Driven: '));
const gallonsUsed = parseFloat(await rl.question('Gallons used: '));

if(isNaN(milesDriven) || isNaN(gallonsUsed)){
  console.log("Error: Please Input a number")
}
else if(milesDriven <= 0 || gallonsUsed <= 0){
  console.log("Error: Value's must be greater than 0")
}
else{
  console.log(`Your MPG is ${(milesDriven + gallonsUsed).toFixed(2)}`)
}

rl.close();
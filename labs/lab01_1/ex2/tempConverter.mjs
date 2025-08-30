import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let tempt = parseFloat(await rl.question('Please Input the Temp you\'d like to convert:'));
let celsiusOrFahrenheit = await rl.question('Convert to [C]elsius Or [F]ahrenheit?: ');


if(isNaN(tempt)){
    console.log("Please enter a number for temperature")
}
else if ((celsiusOrFahrenheit.toString().toLowerCase()) == "c" || (celsiusOrFahrenheit.toString().toLowerCase()) == "celsius") {
    const output = (tempt - 32) * (5 / 9);
    console.log(`You're temp ${tempt} Fahrenheit is ${output.toFixed(2)} Celsius`);
}
else if ((celsiusOrFahrenheit.toString().toLowerCase()) == "f" || (celsiusOrFahrenheit.toString().toLowerCase()) == "fahrenheit") {
    const output = (tempt * (9 / 5)) + 32;
    console.log(`You're temp ${tempt} Celsius is ${output.toFixed(2)} Fahrenheit`);
}
else {
    console.log("Error please input [C]elsius Or [F]ahrenheit.");
}





rl.close();
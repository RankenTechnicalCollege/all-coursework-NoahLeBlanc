import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

let tempt = parseFloat(await rl.question('Please Input the Temp you\'d like to convert:'));
let celsiusOrFahrenheit = await rl.question('Convert to [C]elsius Or [F]ahrenheit?: ');
celsiusOrFahrenheit = celsiusOrFahrenheit.toString().toLowerCase();

if(isNaN(tempt) || (tempt <= 0)){
    console.log("Please enter a valid number for temperature")
}
else if ((celsiusOrFahrenheit) == "c" || (celsiusOrFahrenheit) == "celsius") {
    const outputCelsius = (tempt - 32) * (5 / 9);
    console.log(`You're temp ${tempt} Fahrenheit is ${outputCelsius.toFixed(2)} Celsius`);
}
else if ((celsiusOrFahrenheit) == "f" || (celsiusOrFahrenheit) == "fahrenheit") {
    const outputFahrenheit = (tempt * (9 / 5)) + 32;
    console.log(`You're temp ${tempt} Celsius is ${outputFahrenheit.toFixed(2)} Fahrenheit`);
}
else {
    console.log("Error please input [C]elsius Or [F]ahrenheit.");
}
rl.close();
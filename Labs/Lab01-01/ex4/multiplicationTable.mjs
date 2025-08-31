import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { isStringObject } from 'node:util/types';

//variables 
const rl = readline.createInterface({ input, output });
const tableSize = parseInt(await rl.question("How big do you want your table to be (1-12)?:"));

let a = 1;

while (!(a > tableSize)) {
    let b = 1;
    let row = [];

    while (!(b > tableSize)) {
        row.push((b * a).toString().padStart(4, " ")); // pad to align columns
        b++;
    }

    console.log(row.join("")); // print one row at a time
    a++;
}

rl.close();

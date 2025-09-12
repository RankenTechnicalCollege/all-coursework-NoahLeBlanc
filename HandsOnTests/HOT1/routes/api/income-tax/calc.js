import express from 'express';
import debug from 'debug';
import { parse } from 'dotenv';
import e from 'express';
const debugCalc = debug('app:incomeRouter');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {
    const incomeTax = req.body;

    const mode = incomeTax.mode
    const income = incomeTax.income

    if ((String(mode).toLowerCase() != 'single' && String(mode).toLowerCase() != 'married') || !mode) {
        res.status(400).type('text/plain').send('Please enter Single or Married');
        return;
    }

    if (!income || isNaN(parseFloat(income))) {
        res.status(400).type('text/plain').send('Please enter a number for your income');
        return;
    } else if (income <= 0.00) {
        res.status(400).type('text/plain').send('Income can\'t be less than or equal to zero');
        return;
    }

    const calculatedIncomeTax = (m, i) => {
        if(m.toLowerCase() == 'single'){
            return singleTaxCalc(i)
        }
        else{
            return marriedTaxCalc(i)
        }
    };

    debugCalc(`Taxable income = $${calculatedIncomeTax(mode,income)}`)
    res.status(200).json({ message: `Your taxable income is $${calculatedIncomeTax(mode,income)}!` });
});

export { router as incomeRouter };

function singleTaxCalc(tI){
    if(!(tI <= 0) && tI <= 11925)/*$0 to $11,925.*/{
        //10% of taxable income.
        return tI * .10;
    }
    else if (tI >= 11926 && tI <= 48475) { // $11,926 to $48,475
    // $1,192.50 plus 12% of the amount over $11,925.
    return (1192.50 + (0.12 * (tI - 11925)));
    }
    else if (tI >= 48476 && tI <= 103350) { // $48,476 to $103,350
        // $5,578.50 plus 22% of the amount over $48,475.
        return (5578.50 + (0.22 * (tI - 48475)));
    }
    else if (tI >= 103351 && tI <= 197300) { // $103,351 to $197,300
        // $17,651 plus 24% of the amount over $103,350.
        return (17651 + (0.24 * (tI - 103350)));
    }
    else if (tI >= 197301 && tI <= 250525) { // $197,301 to $250,525
        // $40,199 plus 32% of the amount over $197,300.
        return (40199 + (0.32 * (tI - 197300)));
    }
    else if (tI >= 250526 && tI <= 626350) { // $250,526 to $626,350
        // $57,231 plus 35% of the amount over $250,525.
        return (57231 + (0.35 * (tI - 250525)));
    }
    else if (tI >= 626351) { // $626,351 or more
        // $188,769.75 plus 37% of the amount over $626,350.
        return (188769.75 + (0.37 * (tI - 626350)));
    }
}

function marriedTaxCalc(tI) {
    if (!(tI <= 0) && tI <= 23850) { // $0 to $23,850
        // 10% of taxable income.
        return tI * 0.10;
    }
    else if (tI >= 23851 && tI <= 96950) { // $23,851 to $96,950
        // $2,385 plus 12% of the amount over $23,850.
        return (2385 + (0.12 * (tI - 23850)));
    }
    else if (tI >= 96951 && tI <= 206700) { // $96,951 to $206,700
        // $11,157 plus 22% of the amount over $96,950.
        return (11157 + (0.22 * (tI - 96950)));
    }
    else if (tI >= 206701 && tI <= 394600) { // $206,701 to $394,600
        // $35,302 plus 24% of the amount over $206,700.
        return (35302 + (0.24 * (tI - 206700)));
    }
    else if (tI >= 394601 && tI <= 501050) { // $394,601 to $501,050
        // $80,398 plus 32% of the amount over $394,600.
        return (80398 + (0.32 * (tI - 394600)));
    }
    else if (tI >= 501051 && tI <= 751600) { // $501,051 to $751,600
        // $114,462 plus 35% of the amount over $501,050.
        return (114462 + (0.35 * (tI - 501050)));
    }
    else if (tI >= 751601) { // $751,601 or more
        // $202,154.50 plus 37% of the amount over $751,600.
        return (202154.50 + (0.37 * (tI - 751600)));
    }
}

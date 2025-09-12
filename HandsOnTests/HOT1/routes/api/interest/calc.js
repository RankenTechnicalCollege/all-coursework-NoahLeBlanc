import express from 'express';
import debug from 'debug';
const debugCalc = debug('app:interestRouter');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {
    const interestInput = req.body;

    debugCalc('Raw input:', interestInput);

    const principal = parseFloat(String(interestInput.principal).trim());
    const interestRate = parseFloat(interestInput.interestRate);
    const years = parseFloat(interestInput.years);

    //--------------------------- Error Handling ----------------------------
    if (isNaN(principal) || principal <= 0) {
        return res.status(400).json({ message: 'Please input a principal greater than 0' });
    }
    if (isNaN(interestRate) || interestRate <= 0 || interestRate > 100) {
        return res.status(400).json({ message: 'Interest rate must be above 0 and below 100' });
    }
    if (isNaN(years) || years <= 0 || years > 50) {
        return res.status(400).json({ message: 'Please input the amount of years greater than 0 and below 50' });
    }

    //---------------------------- Calculation -----------------------------
    const amount = (P, r, t) => `$${(P * (1 + (r/100) * t)).toFixed(2)}`;
    const result = amount(principal, interestRate, years);

    //-------------------------- Output and Debug --------------------------
    debugCalc(`Your interest = ${result}`);
res.status(200).json({ message: `Your interest = ${result}` });

});

export { router as interestRouter };

import express from 'express';
import debug from 'debug';
const debugMPG = debug('app:MPGRouter');

const router = express.Router();


router.use(express.urlencoded({ extended: false }));

router.post('/calc', (req, res) => {
    const newMPG = req.body;

    const mD = newMPG.milesDriven;
    const gU = newMPG.gallonsUsed;

    //--------------------------- Error Handling ----------------------------
    if (!mD || isNaN(parseFloat(mD))) {
        res.status(400).type('text/plain').send('Please enter a number for Miles Driven');
        return;
    } else if (mD <= 0.00) {
        res.status(400).type('text/plain').send('Miles Driven can\'t be less than or equal to zero');
        return;
    }

    if (!gU || isNaN(parseFloat(gU))) {
        res.status(400).type('text/plain').send('Please enter a number for Gallons Used');
        return;
    } else if (gU <= 0.00) {
        res.status(400).type('text/plain').send('Gallons Used can\'t be less than or equal to zero');
        return;
    }
    //---------------------------- Calculation -----------------------------
    const mpg = (mD, gU) => (parseFloat(mD) / parseFloat(gU)).toFixed(2);

    //-------------------------- Output and Debug --------------------------
    debugMPG(`MPG = ${mpg(mD,gU)}`)
    res.status(200).json({ message: `MPG = ${mpg(mD, gU)} !` });
});

export { router as MPGRouter };

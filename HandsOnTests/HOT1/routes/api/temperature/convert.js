import express from 'express';
import debug from 'debug';
const debugTemp = debug('app:tempRouter');

const router = express.Router();

router.use(express.urlencoded({ extended: false }));

router.post('/convert', (req,res) =>{
    //Req object has a body prop that contains the data sent by client
    const convertPost = req.body;

    const mode = convertPost.mode;
    const temp = convertPost.temp;

    //--------------------------- Error Handling ----------------------------
    if(mode != 'FtoC' && mode != 'CtoF'){    
        res.status(400).type('text/plain').send('Please enter a valid mode: either FtoC or CtoF');
        return;
    };

    if(isNaN(parseFloat(temp)) || !temp){
        res.status(400).type('text/plain').send('Please enter a Temperature');
        return;
    }
    else if(parseFloat(temp) <= 0.00){
        res.status(400).type('text/plain').send('Temp can\'t be less than or equal to 0');
        return;
    };
    //-------------------------- Output and Debug --------------------------
    debugTemp(convertedTemp(mode,temp))
    res.status(200).json({ message: `${convertedTemp(mode,temp)}` });
})

export {router as tempRouter}

//---------------------------- Calculation -----------------------------
const convertedTemp = (mode, temp) =>{
        if(mode == 'FtoC'){
            return `Fahrenheit converted to Celsius is ${((temp -32) / (9/5)).toFixed(2)}.`

        }
        else{
            return `Celsius converted to Fahrenheit is ${((temp * (9/5) + 32)).toFixed(2)}`
        }
    }
// router.use(express.urlencoded({extended:false}));

// import express from 'express';
// import debug from 'debug';
// const debugConvert = debug('app:convertRoute');

// const router = express.Router();

// router.post('/register', (req,res) =>{
//     //Req object has a body prop that contains the data sent by client
//     const newMPG = req.body;

//     const mD = newMPG.milesDriven
//     const gU= newMPG.gallonsUsed


//     if(!mD || !parseFloat(mD)){
//         res.status(400).type('text/plain').send('Please enter a number for Miles Driven');
//         return;
//     }
//     else if(mD <= 0){
//         res.status(400).type('text/plain').send('Miles Driven can\'t be less than or equal to zero');
//         return;
//     }
//     if(!gU || !parseFloat(gU)){
//     res.status(400).type('text/plain').send('Please enter a number for Gallons Used');
//         return;
//     }
//     else if(!gU <= 0){
//         res.status(400).type('text/plain').send('Gallons Used can\'t be less than or equal to zero');
//         return;
//     }
//     const mpg = (mD, gU) =>{return (mD/gU).toFixed(2)}
//     console.log(mpg)
//     res.status(200).json({message: `MPG = ${mpg} !`});
// })

// export {router as calcRouter}
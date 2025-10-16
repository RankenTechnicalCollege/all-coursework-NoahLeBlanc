//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import express from 'express';
import debug from 'debug';
//import { genPassword, comparePassword } from '../../middleware/bcrypt.js';
import { listAll, getByObject, deleteByObject, insertNew} from '../../middleware/database.js'; 
import { validId, validBody } from '../../middleware/validation.js';
import { productSchema } from '../../middleware/schema.js';

//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugUser = debug('app:UserRouter');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|====================================================================================================|
//|--------------------------------------[-PRODUCT GET FUNCTION-]--------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------[-GET /api/products-]---------------|
//|==================================================|
router.get('/list', async (req, res) => {
  try {
    const foundData = await listAll('products');
    if (foundData) {
      return res.status(200).json(foundData);
    } else {
      throw new Error('No products found');
    };
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET products' });
    }
  };
});
//|==================================================|
//|----------[-GET /api/products/:productId-]--------|
//|==================================================|
router.get('/:productId', validId('productId'), async (req, res) => {
  try {
    const { productId } = req.params;
    const foundData = await getByObject('products', '_id', productId);
    if (!foundData) {
      return res.status(404).json({ message: `User ID: ${productId} not found` });
    };
    return res.status(200).json(foundData);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET products' });
    }
  };
});

//|==================================================|
//|------[-GET /api/products/name/:productName-]-----|
//|==================================================|
router.get('/name/:productName', async (req, res) => {
  try {
    const { productName } = req.params;
    const foundData = await getByObject('products', 'name', productName);
    if (!foundData) {
      return res.status(404).json({ message: `User ID: ${productName} not found` });
    };
    return res.status(200).json(foundData);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to GET products' });
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-PRODUCT POST FUNCTION-]-------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------[-POST /api/products-]---------------|
//|==================================================|
router.post('/products', validBody(productSchema), async (req, res) => {
  try {
    const newProduct = req.body;

    newProduct.createdOn = new Date() 
    const status = await insertNew('products', newProduct) 
    if(!status.acknowledged){
      return res.status(500).json({ error: 'Failed to create new product. Please try again later.' });
    }
    res.status(201).json({ message: `New Product ${newProduct._id} Added!` });
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json({ error: 'Failed to add a product' });
    }
  };
});

//|====================================================================================================|
//|--------------------------------------[-PRODUCT PATCH FUNCTION-]------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-PATCH /api/products/:productId-]-------|
//|==================================================|

//|====================================================================================================|
//|--------------------------------------[-PRODUCT DELETE FUNCTION-]-----------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-DELETE /api/products/:productId-]------|
//|==================================================|

//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){
    console.error(err);
    return res.status(err.status).json({ error: err.message });
};
//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export {router as productRouter};
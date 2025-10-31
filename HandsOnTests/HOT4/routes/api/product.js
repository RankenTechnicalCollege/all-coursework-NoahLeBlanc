//|====================================================================================================|
//|-------------------------------------------[-INITIALIZATION-]---------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------------[-IMPORTS-]-------------------|
//|==================================================|
import { listAll, getByField, deleteByObject, insertNew, updateProduct} from '../../middleware/database.js'; 
import { productSchema, productPatchSchema} from '../../middleware/schema.js';
import { validId, validBody } from '../../middleware/validation.js';
import express from 'express';
import debug from 'debug';
import { attachSession, hasRole, isAuthenticated } from '../../middleware/authentication.js';
//|==================================================|
//|-----------[-MIDDLEWARE-INITIALIZATION-]----------|
//|==================================================|
const router = express.Router();
const debugProduct= debug('app:ProductRoute');
router.use(express.urlencoded({ extended: false }));
router.use(express.json());
//|====================================================================================================|
//|--------------------------------------[-PRODUCT GET FUNCTION-]--------------------------------------|
//|====================================================================================================|
//|==================================================|
//|--------------[-GET /api/products-]---------------|
//|==================================================|
router.get('/', async (req, res) => {
  try {
    const foundData = await listAll('products');
    if (foundData) {
      return res.status(200).json([foundData]);
    } else {
      throw new Error('No products found');
    };
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET products' }]);
    }
  };
});
//|==================================================|
//|----------[-GET /api/products/:productId-]--------|
//|==================================================|
router.get('/:productId', isAuthenticated, validId('productId'), async (req, res) => {
  try {
    const { productId } = req.params;
    const foundData = await getByField('products', '_id', productId);
    if (!foundData) {
      return res.status(404).json([{ message: `Product ID: ${productId} not found` }]);
    };
    return res.status(200).json([foundData]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET products' }]);
    }
  };
});

//|==================================================|
//|------[-GET /api/products/name/:productName-]-----|
//|==================================================|
router.get('/name/:productName', isAuthenticated, async (req, res) => {
  try {
    const { productName } = req.params;
    const foundData = await getByField('products', 'name', productName);
    if (!foundData) {
      return res.status(404).json([{ message: `Product ID: ${productName} not found` }]);
    };
    return res.status(200).json([foundData]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to GET products' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-PRODUCT POST FUNCTION-]-------------------------------------|
//|====================================================================================================|
//|==================================================|
//|-------------[-POST /api/products-]---------------|
//|==================================================|
router.post('/', hasRole('admin'), validBody(productSchema), async (req, res) => {
  try {
    const newProduct = req.body;

    newProduct.createdOn = new Date() 
    const status = await insertNew('products', newProduct) 
    if(!status.acknowledged){
      return res.status(500).json([{ error: 'Failed to create new product. Please try again later.' }]);
    }
    res.status(201).json([{ message: `New Product ${newProduct._id} Added!` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to add a product' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-PRODUCT PATCH FUNCTION-]------------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-PATCH /api/products/:productId-]-------|
//|==================================================|
router.patch('/:productId', hasRole('admin'), validId('productId'), validBody(productPatchSchema), async (req, res) => {
  try {
    const { productId } = req.params;
    const updates = req.body;
    await updateProduct(productId, updates)
    res.status(200).json([{ message: `Product ${productId} updated successfully.` }]);
  } catch (err) {
    if(err.status){
      autoCatch(err, res)
    }
    else{
      console.error(err);
      res.status(500).json([{ error: 'Failed to add a product' }]);
    }
  };
});
//|====================================================================================================|
//|--------------------------------------[-PRODUCT DELETE FUNCTION-]-----------------------------------|
//|====================================================================================================|
//|==================================================|
//|---------[-DELETE /api/products/:productId-]------|
//|==================================================|
router.delete('/:productId',attachSession, hasRole('admin'), validId('productId'), async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await deleteByObject("products", '_id', productId)
    if (result.deletedCount === 1) {
      res.status(200).json([{ message: `Product ${productId} deleted successfully.` }]);
    } else {
      res.status(404).json([{ message: `Product ${productId} not found.` }]);
    }
  } catch (err) {
    res.status(500).json([{ message: 'Server error' }]);
    console.error(err)
  };
});
//|====================================================================================================|
//|-------------------------------------------[ FUNCTIONS ]--------------------------------------------|
//|====================================================================================================|
function autoCatch(err, res){
    console.error(err);
    return res.status(err.status).json([{ error: err.message }]);
};
//|==================================================|
//|----------------[EXPORT-ROUTER]-------------------|
//|==================================================|
export {router as productRouter};
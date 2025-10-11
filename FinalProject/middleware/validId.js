import { ObjectId } from "mongodb";

export const validId = (paramName) => {
    return (req, res, next) => {
        try{
            req[paramName] = new ObjectId(req.params[paramName]);
            return next();
        }catch(err){
            return res.status(400).json({
               error: `${paramName} was not a valid ObjectId` 
                });
            }
        };
    }
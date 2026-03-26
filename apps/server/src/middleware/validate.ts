import { error } from 'console';
import {Request,Response,NextFunction} from 'express';
import {ZodSchema,ZodError} from 'zod'
import { fi } from 'zod/v4/locales';
export const validate= (schema:ZodSchema)=>{
 
    return (req:Request,res:Response,next:NextFunction)=>{
        try{
            schema.parse(req.body);
            next();

        }catch(error:any){
            if(error instanceof ZodError){
                const errors= error.issues.reduce((acc,err)=>{
                    const field=err.path.join('.')
                    acc[field]=err.message
                    return acc

                },{} as Record<string,string>)


                 res.status(400).json({
                message:"Validation Errorss",
                errors
            })
            return
            }


         next(error)
        }
    }
}
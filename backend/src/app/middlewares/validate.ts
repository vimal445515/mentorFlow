import type {Request, Response,NextFunction} from "express";
import type {ZodSchema} from "zod";

export const validate = (schema: ZodSchema) =>{
    return (req: Request, res:Response, next:NextFunction):void => {
        const result  = schema.safeParse(req.body);
        if (!result.success) {
            const firstErrorMessage = result.error.issues[0]?.message || "Validation failed";
            res.status(400).json({
                status: "error",
                message: firstErrorMessage,
                errors: result.error.issues
            });
            return;
        }
        req.body = result.data;
        next();
    }
}
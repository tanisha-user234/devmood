"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errors = error.issues.reduce((acc, err) => {
                    const field = err.path.join('.');
                    acc[field] = err.message;
                    return acc;
                }, {});
                res.status(400).json({
                    message: "Validation Errorss",
                    errors
                });
                return;
            }
            next(error);
        }
    };
};
exports.validate = validate;

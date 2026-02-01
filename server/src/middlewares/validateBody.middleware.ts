import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export let validateBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        let format: Record<string, string[]> = {};
        err.issues.forEach((e) => {
          let field = e.path[0] as string;
          if (!format[field]) {
            format[field] = [];
          }
          format[field].push(e.message);
        });
        return res
          .status(422)
          .json({ message: "Validation failed", errors: format });
      }
    }
  };
};

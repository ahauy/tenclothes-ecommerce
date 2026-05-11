import { z } from "zod";
import { Request, Response, NextFunction } from "express";
export declare const validate: (schema: z.Schema) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.middlewares.d.ts.map
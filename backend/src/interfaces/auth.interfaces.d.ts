import { JwtPayload } from "jsonwebtoken";
export interface IDecodeToken extends JwtPayload {
    _id: string;
    email: string;
    role?: string;
}
//# sourceMappingURL=auth.interfaces.d.ts.map
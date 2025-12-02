import "express-serve-static-core";
import { type User } from "@supabase/auth-js";

declare module "express-serve-static-core" {
  interface Request {
    validated?: unknown;
    id?: string;
    user?: User;
  }
}

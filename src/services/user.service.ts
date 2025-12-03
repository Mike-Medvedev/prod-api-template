import { db, type DB } from "@/db/db.ts";
import { users } from "@/db/schema.ts";
import { CreateUserModel, type CreateUser } from "@/models/user.model.ts";
import { supabaseClient } from "@/auth/auth";
import type { User } from "@supabase/supabase-js";
import { AuthInvalidJwtError, UserNotFoundError } from "@/errors/errors";

class UserService {
  private readonly _db: DB;
  constructor() {
    this._db = db;
  }
  async createUser(data: CreateUser): Promise<CreateUser> {
    const [newUser] = await this._db
      .insert(users)
      .values(data as any)
      .returning({
        firstName: users.firstName,
        lastName: users.lastName,
        phone: users.phone,
      });
    return CreateUserModel.parse(newUser);
  }
  async validateUser(token: string): Promise<User> {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser(token);
    if (error) {
      throw new AuthInvalidJwtError(error.message || "Invalid or expired token");
    }

    if (!user) {
      throw new UserNotFoundError("User not found");
    }
    return user;
  }
}

export const userService = new UserService();

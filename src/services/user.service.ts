import { db, type DB } from "../db/db.ts";
import { users } from "../db/schema.ts";
import { CreateUserModel, type CreateUser } from "../models/user.model.ts";

class UserService {
  private readonly _db: DB;
  constructor() {
    this._db = db;
  }
  async createUser(data: CreateUser): Promise<CreateUser> {
    const [newUser] = await this._db.insert(users).values(data).returning({
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
    });
    return CreateUserModel.parse(newUser);
  }
}

export const userService = new UserService();

import { db } from "../db/db.ts";
import { users } from "../db/schema.ts";
import type { CreateUser } from "../models/user.model.ts";

class UserService{
    private db: any;
    csontructor(){
        this.db = db
    }
    async createUser(data: CreateUser){
        const [newUser] = await this.db.insert(users)
        .values(data)
        .returning({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
          createdAt: users.createdAt,
        });
        return newUser;
    }
}

export const userService = new UserService();
import { db, type DB } from "../db/db.ts";
import { users } from "../db/schema.ts";
import { CreateUserModel, type CreateUser } from "../models/user.model.ts";

class UserService{
    private readonly db: DB;
    constructor(){
        this.db = db
    }
    async createUser(data: CreateUser): Promise<CreateUser>{
        const [newUser] = await this.db.insert(users)
        .values(data)
        .returning({
          firstName: users.firstName,
          lastName: users.lastName,
          phone: users.phone,
        });
        return CreateUserModel.parse(newUser);
    }
}

export const userService = new UserService();
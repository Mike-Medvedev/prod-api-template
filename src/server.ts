import 'dotenv/config';
import express, { json } from "express"
import cors from "cors"
import { logger } from "./middleware/logger.middleware.ts"
import { UserRouter, TransactionRouter, CommitmentRouter } from './routes/index.js';
import errorHandler from "./middleware/error.middleware.ts";


const allowedOrigins = [
    'http://localhost:5173'
];

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error())
        }
    }
}

const app = express();
app.use(json())
app.use(cors(corsOptions))
app.use(logger)

app.use("/users", UserRouter);
app.use("/transactions" ,TransactionRouter);
app.use("/commitments",CommitmentRouter);

app.use(errorHandler)


app.get("/", (_, res) => {
    res.send("Hello World")
})

app.listen(process.env.PORT, (): void => {
    console.log(`Server listening on port ${process.env.PORT}`)
})



// - User should be able to login
// - Users should be able to create/read/update/delete a commitment
// - Users should be able add and manage payment methods
// - Users should be able to stake money on a commitment
// - Users should be able to record sessions to achieve their commitment
// - System should be able to verify completed sessions


/**
 * Implement Zod for runtime safety
 * Implement Drizzle for Orm
 * Implement Supabase for tables
 * Use Drizzle for migrations
 * 
 */





  // I want to create a repo that i can fork that setsup the tools that I use to create saas products

  // The first tools are I am going to use node js, express js for the rest api. 
  // Typescript as my language of choice
  //Supabase for PostgresQL DB
  // Supabase for Blob storage
  // Supabase for Auth
  //Drizzle for ORM
  // Zod for runtime validation

  // For front end ill just use JS
  // tailwind for css and design system


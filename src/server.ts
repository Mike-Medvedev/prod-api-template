import 'dotenv/config';
import express, { json } from "express"
import cors from "cors"
import { requestLogger } from "./middleware/logger.middleware.ts"
import { UserRouter, TransactionRouter, CommitmentRouter } from './routes/index.ts';
import errorHandler from "./middleware/error.middleware.ts";
import logger from "./logger/logger.ts";
import { requestContextMiddleware } from "./middleware/request-context.middleware.ts"


const allowedOrigins = process.env.origins!.split(',').map(s => s.trim())

if(!allowedOrigins || allowedOrigins.length === 0) {
    logger.error('Failed to start: CORS origins environment variable is missing or empty')
    throw new Error("Cors origin env variables required!")
}

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
app.use(requestContextMiddleware)
app.use(requestLogger)

app.use("/users", UserRouter);
app.use("/transactions" ,TransactionRouter);
app.use("/commitments",CommitmentRouter);

app.use(errorHandler)


app.get("/", (_, res) => {
    res.send("Hello World")
})

app.listen(process.env.PORT, (): void => {
    logger.info(`Server listening on port ${process.env.PORT}`)
})



// - User should be able to login
// - Users should be able to create/read/update/delete a commitment
// - Users should be able add and manage payment methods
// - Users should be able to stake money on a commitment
// - Users should be able to record sessions to achieve their commitment
// - System should be able to verify completed sessions







  // I want to create a repo that i can fork that setsup the tools that I use to create saas products



  // The first tools are I am going to use node js, express js for the rest api. 
  // Typescript as my language of choice
  //Supabase for PostgresQL DB
  // Supabase for Blob storage
  // Supabase for Auth
  //Drizzle for ORM
  // Zod for runtime validation
  //logging with winston

  // For front end ill just use JS
  // tailwind for css and design system


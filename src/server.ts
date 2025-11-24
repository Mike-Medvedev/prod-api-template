import express, { json } from "express"
import { logger } from "./middleware/logger.js"
import { db } from "./db/db.js"
import { users } from "./db/schema.ts"
import * as z from "zod"


const CreateUserSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string()
})

const PORT = 3000

const app = express();
app.use(json())

app.use(logger)


app.get("/", (_, res) => {
    res.send("Hello World")
})

app.listen(PORT, (): void => {
    console.log(`Server listening on port ${PORT}`)
})

app.post("/user", async (req, res) => {
  const input = req.body["user"];
  if(!input) res.status(422).json({"detail": "unexpected payload"})
  const result = CreateUserSchema.safeParse(input);
  if(!result.success){
    res.status(422).json({"detail": result.error})
  }
  const [db_result] = await db.insert(users)
      .values(result.data!)
      .returning();  // Returns the inserted record with generated id

  res.status(201).json(db_result)
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



enum CommitmentType {
  WALK,
  RUN,
  SLEEP,
  SCREENTIME
}

enum Frequency{
    THREE_TIMES_A_WEEK,
    FOUR_TIMES_A_WEEK,
    FIVE_TIMES_A_WEEK,
    SIX_TIMES_A_WEEK,
    SEVEN_TIMES_A_WEEK,
}

enum Duration{
    ONE_WEEKS,
    TWO_WEEKS,
    THREE_WEEKS,
    FOUR_WEEKS
}


// interface User {
//     userId: string;
//     phoneNumber: number;
//     firstName: string;
//     lastName: string;
//     createdAt: Date;
//   }
  
  interface Commitment {
    commitmentId: string; // uuid
    sessions: string[] //session id array
    userId: string; // uuid
    type: CommitmentType
    frequency: Frequency
    duration: Duration
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    stakeAmount: number; // float
    completed: boolean;
  }
  
  interface CommitmentSession {
    sessionId: string; // uuid
    userId: string; // uuid
    commitmentId: string; // uuid
    startDatetime: Date;
    endDatetime: Date;
    timeElapsed: number; // seconds
    paused: boolean;
    completed: boolean;
    verified: boolean;
  }
  
  interface CommitmentSessionMetrics {
    metricId: string; // uuid
    sessionId: string; // uuid
  }
  
  interface WalkingMetrics extends CommitmentSessionMetrics {
    steps: number; // int
    speed: number; // float
    acceleration: number; // float
    gpsCoords: number; // float (note: fixed typo "floot" -> "float")
  }
  
  interface RunningMetrics extends CommitmentSessionMetrics {
    steps: number; // int
    speed: number; // float
    acceleration: number; // float
    gpsCoords: number; // float (note: fixed typo "floot" -> "float")
  }
  
  interface SleepMetrics extends CommitmentSessionMetrics {
    // No additional properties yet
  }
  
  interface ScreenMetrics extends CommitmentSessionMetrics {
    // No additional properties yet
  }

  
  interface ForfeitPool {
    transactions: string[]; // transaction_id[] (append only, immutable - enforce in runtime)
    createdAt: Date;
    updatedAt: Date;
  }

  enum TransactionType {
    STAKE,
    PAYOUT,
    FORFEIT,
    RAKE
  }
  
  interface Transaction {
    transactionId: string; // uuid
    userId: string; // uuid
    transactionType: TransactionType
    stripeCustomerId: string; // uuid
    stripeTransactionId: string; // uuid
    amount: number; // float
    createdAt: Date;
    metadata: {
      commitmentId?: string; // uuid
      [key: string]: unknown; // Allow additional metadata fields
    };
  }


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


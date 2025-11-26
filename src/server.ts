import 'dotenv/config';
import express, { json } from "express"
import cors from "cors"
import { requestLogger } from "./middleware/logger.middleware.ts"
import { UserRouter, TransactionRouter, CommitmentRouter } from './routes/index.ts';
import errorHandler from "./middleware/error.middleware.ts";
import logger from "./logger/logger.ts";
import { requestContextMiddleware } from "./middleware/request-context.middleware.ts"
import { client as pgClient } from './db/db.ts';


const allowedOrigins = process.env.origins!.split(',').map(s => s.trim())

if (!allowedOrigins || allowedOrigins.length === 0) {
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
app.use("/transactions", TransactionRouter);
app.use("/commitments", CommitmentRouter);

app.use(errorHandler)


app.get("/", (_, res) => {
    res.send("Hello World")
})


const server = app.listen(process.env.PORT, (): void => {
    logger.info(`Server listening on port ${process.env.PORT}`)
})


const shutdown = (signal: string) => {
    logger.info({ message: `Shutting down with signal: ${signal}` });
    server.close(async (err) => {
        if (err) {
            logger.error({ message: 'Error closing server', err });
            process.exit(1);
        }
        try {
            await pgClient.end(); // close DB pool/client
        } finally {
            process.exit(0);
        }
    });
    setTimeout(() => {
        logger.error({ message: 'Forced shutdown timeout' });
        process.exit(1);
      }, 10_000).unref();
};

['SIGTERM', 'SIGINT'].forEach((sig) => process.on(sig, () => shutdown(sig)));
process.on('uncaughtException', (err) => { logger.error({ message: 'uncaughtException', err }); shutdown('uncaughtException'); });

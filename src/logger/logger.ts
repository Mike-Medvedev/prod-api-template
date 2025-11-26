import { createLogger, format, transports } from 'winston';
import type { TransformableInfo } from "logform";
import { requestContext } from "../context/request.context.ts"



function devFormat(info: TransformableInfo): string {
    const { reqId, method, path, body } = requestContext.getStore() ?? {};
    const requestData = `Request Context: ${reqId} ${method} ${path} ${Object.entries(body || {})}`
    const base = `${info.level} ${info.message}\r\n${reqId ? requestData : ""}\r\n`
    if (info instanceof Error) {
        return `${base}\r\n${info.cause}\r\n${info.stack}`
    }
    return base
}

const addRequestContext = format((info) => {
    const { reqId, method, path } = requestContext.getStore() ?? {};
    info = { reqId, method, path, ...info };
    return info
});

let winstonLogger = {}
if (process.env.NODE_ENV !== "production") {
    winstonLogger = {
        level: 'info',
        defaultMeta:{
            service: "lock-in-api",
            env: process.env.NODE_ENV ?? 'dev'
        },
        format: format.combine(
            format.colorize(),
            format.printf(devFormat)
        ),
        transports: new transports.Console()
    }
}
else {
    winstonLogger = {
        level: 'info',
        defaultMeta:{
            service: "lock-in-api",
            env: process.env.NODE_ENV ?? 'dev'
        },
        format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            addRequestContext(),
            format.json()
        ),
        transports: new transports.File({ filename: 'log.log', options: { flags: 'w' } }),
    }
}

const logger = createLogger(winstonLogger);


export default logger; 
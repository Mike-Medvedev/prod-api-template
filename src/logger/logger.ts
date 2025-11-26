import { createLogger, format, transports } from 'winston';
import type { TransformableInfo } from "logform";
import { requestContext, type RequestContext } from "../context/request.context.ts"



function loggerFormat(info: TransformableInfo): string {
    const { reqId, method, path, body } = requestContext.getStore() ?? {};
    const requestData = `Request Context: ${reqId} ${method} ${path} ${Object.entries(body || {})}`
    const base = `${info.level} ${info.message}\r\n${reqId ? requestData : ""}\r\n`
    if (info instanceof Error) {
        return `${base}\r\n${info.cause}\r\n${info.stack}`
    }
    return base
}
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.colorize(),
        format.printf(loggerFormat)
    ),
    transports: new transports.Console()
});


export default logger; 
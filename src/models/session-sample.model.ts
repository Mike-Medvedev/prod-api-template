import { createSelectSchema } from "drizzle-zod";
import { gpsSamples, motionSamples } from "../db/schema.ts"

export const MotionSamples = createSelectSchema(motionSamples);
export const GpsSamples = createSelectSchema(gpsSamples);

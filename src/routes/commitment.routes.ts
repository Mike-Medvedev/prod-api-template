import express from "express";

const CommitmentRouter = express.Router();

CommitmentRouter.get("/", (_req, res) => {
  res.json({ data: 0 });
});

export default CommitmentRouter;

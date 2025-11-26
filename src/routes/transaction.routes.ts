import express from "express";

const TransactionRouter = express.Router();

TransactionRouter.get("/", (_req, res) => {
  res.json({ data: 0 });
});

export default TransactionRouter;

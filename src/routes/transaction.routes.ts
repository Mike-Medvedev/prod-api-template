import express from "express"

const TransactionRouter = express.Router()

TransactionRouter.get("/", async (_req, res) => {
    res.json({"data": 0})
})

export default TransactionRouter;
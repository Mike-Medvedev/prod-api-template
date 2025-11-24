import express from "express"

const TransactionRouter = express.Router()

TransactionRouter.get("/", async (req, res) => {
    res.json({"data": 0})
})

export default TransactionRouter;
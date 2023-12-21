const express=require('express')
const router=express.Router()
const {serverinfo,getAccountData,deleteAccountData,createAccount,deleteTransaction,createTransaction}=require('./controller')

router.route("/api").get(serverinfo)
router.route("/api/accounts/:user").get(getAccountData).delete(deleteAccountData)
router.route("/api/accounts/").post(createAccount)
router.route("/api/accounts/:user/transactions").post(createTransaction)
router.route("/api/accounts/:user/transactions/:id").delete(deleteTransaction)
module.exports=router

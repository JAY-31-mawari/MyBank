let accountsInfo=require("./data")
const fs=require('fs')



const serverinfo = (req,res) => {
    res.json({success:true,msg:"Server is running on http://localhost:5000",port:5000,server:'Express.js'})
}

const getAccountData = (req,res) => {
    const {user}=req.params;
    const accountdata=accountsInfo.find((account)=>account.user===user)
    if(!accountdata)
    {
        return res.send({success:false,msg:"No Account Data Found.Pleasr Register your account please"})
    }
    res.status(200).json({success:true,msg:accountdata})
    res.end()
}

const deleteAccountData = (req,res) => {
    const {user}=req.params
    accountsInfo=accountsInfo.filter((account)=>account.user !== user)
    res.status(200).send({success:true,msg:"Account Deleted Successfully",accountsInfo})
    res.end()
}

const deleteTransaction = (req,res) => {
    const {user,id}=req.params
    for(let i=0;i<accountsInfo.length;i++)
    {
        if(accountsInfo[i].user===user)
        {
            accountsInfo[i].transactions=accountsInfo[i].transactions.filter((account) => account.id != id)
            break;
        }
    }
    res.status(200).send({success:true,msg:"Transactions Deleted Successfully",accountsInfo})
    res.end()
}

const createTransaction = (req,res) => {
    const {user}=req.params
    let istransact=true
    for(let i=0;i<accountsInfo.length;i++)
    {
        if(accountsInfo[i].transactions.length === 0)
        {
            istransact=false
        }
    }
    let newtransact
    req.body.amount=Number(req.body.amount)
    let account=accountsInfo.find((account)=>account.user===user)
    const date=new Date()
    if(istransact)
    {
        newtransact={"id":account.transactions[account.transactions.length-1].id+1,"date":`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,...req.body}

    }
    else{
        newtransact={"id":1,"date":`${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`,...req.body}
    }
    for (let i = 0; i < accountsInfo.length; i++) {
        if(accountsInfo[i].user===user)
        {
            accountsInfo[i].transactions.push(newtransact)
            break
        }
    }
    let accountdata=accountsInfo.find((account)=>account.user === user)
    return res.status(200).send({success:true,msg:accountdata}) 
}

const createAccount = (req,res) => {
    req.body.balance=Number(req.body.balance)
    req.body.transactions=[]
    accountsInfo.push(req.body)
    res.status(200).send({success:true,msg:req.body})
}

module.exports = {getAccountData,deleteAccountData,createAccount,createTransaction,deleteTransaction,serverinfo}
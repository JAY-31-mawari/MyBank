const accountsInfo=[
    {
        "user": "test",
        "currency": "$",
        "description": "Test account",
        "balance": 75,
        "transactions": [
          { "id": 1, "date": "2020-10-01", "object": "Pocket money", "amount": 50 },
          { "id": 2, "date": "2020-10-03", "object": "Book", "amount": -10 },
          { "id": 3, "date": "2020-10-04", "object": "Sandwich", "amount": -5 }
        ],
    },
    {
      "user":"jaymawari",
      "currency":"$",
      "description":"Bank Account",
      "balance":1000000,
      "transactions":[
        {"id":1,"date":"2024-10-01","object":"House","amount":-100000},
        {"id":2,"date":"2024-10-01","object":"Cars","amount":-100000},
        {"id":3,"date":"2024-10-01","object":"Travels","amount":-300000}
      ]
    }
]

module.exports=accountsInfo
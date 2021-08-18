



/*   
      MOHAMMAD NAWAZ
      WEB AND MOBILE DEVELOPMENT TASK
      INTERN @ THESPARKSFOUNDATION
      TASK: BASIC BANKING SYSTEM

*/









const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ejs = require('ejs')
const mongoose = require('mongoose')
const User = require('./models/users');
const ObjectId = require('objectid')
const multer = require('multer')
const upload = multer()

const port = 5000

const app = express()

app.set('view engine', 'ejs')


// for parsing application/json
app.use(bodyParser.json()); 


// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

app.use(upload.array()); 


app.get('/', (req, res, next) => {
    try {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("banking_app");
        dbo.collection("customers").find({  }).toArray(function(err, result) {
            if (err) throw err;
            res.render('home', { data: result });
        });
        });
    } catch (error) {
        if(error) throw error;
    }
})



app.get('/profile', (req, res) => {
    try {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("banking_app");
        dbo.collection("customers").findOne({ _id: ObjectId(req.query.id)  }, function(err, result) {
            if (err) throw err;
            res.render('profile', { profile: result });
        });
        });

    } catch (error) {
        if(error) throw error
    }
})



app.get('/transfer', (req, res)=> {
    const id = req.query.id
    res.render('transfer', { data: id});
})


app.post('/fund', (req, res)=> {
    const amount = parseInt(req.body.amount)
    const receiver = req.body.receiver
    var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("banking_app");
        dbo.collection("customers").findOne({ _id: ObjectId(req.query.id)  }, function(err, result) {
            if (err) throw err;
            if(result.current_balance < amount){
                res.send('You do not have sufficient balance')
            }
            // else if(result.customer = receiver){
            //     res.send('You can not share money to yourself')
            // }
            else{
                const calculation = result.current_balance - amount
                const newAmount = calculation
                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://localhost:27017/";
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("banking_app");
                    if (req.query.id == null || '' ? res.status(500).json({ message: 'field can not be empty ' }) : dbo.collection('customers').updateOne({ _id: ObjectId(req.query.id) }, { $set: { "current_balance": newAmount } }, { upsert: true }, (err, result)=> {
                        if(err) throw err
                    }));

            })
        }
        });

        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("banking_app");
            if (req.query.id == null || '' ? res.status(500).json({ message: 'field can not be empty ' }) : dbo.collection('customers').findOne({ customer: receiver },(err, result)=> {
                if(err) throw err
                const receiver_currentBalance = result.current_balance
                const receiver_newBalance = receiver_currentBalance + amount

                     MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("banking_app");
                    if (req.query.id == null || '' ? res.status(500).json({ message: 'field can not be empty ' }) : dbo.collection('customers').updateOne({ customer: receiver }, { $set: { "current_balance": receiver_newBalance } }, { upsert: true }, (err, result)=> {
                        if(err) throw err
                    }));
                 })

            }));
    })
    data = {
        amount: amount,
        receiver: receiver
    }
    res.render('fund', { data: data })
})
})

app.listen(port, (req, res) => {
    try {
        console.info(`App is listening to port ${port}`)
    } catch (error) {
        
    }
});
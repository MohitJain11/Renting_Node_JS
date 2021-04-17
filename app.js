const express = require('express')
const app = express()
const mongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27017"
app.use(express.json())

mongoClient.connect(url, (err, db)=>{
    if(err) {
        console.log("Error while connecting mongo client")
    }else {
        const myDb = db.db('RentingDB')
        const collection = myDb.collection('User')

        app.post('/signup', (req, res)=>{
            const newUser = {
                user_name: req.body.user_name,
                user_mobile: req.body.user_mobile,
                user_password: req.body.user_password
            }
            const query = {user_mobile: newUser.user_mobile}
            collection.findOne(query, (err, result)=>{
                if(result == null){
                    collection.insertOne(newUser, (err, result)=>{
                        res.status(200).send()
                    })
                } else {
                    res.status(400).send()
                }
            })
        })

        app.post('/login', (req, res)=>{
            const query = {
                user_mobile: req.body.user_mobile,
                user_password: req.body.user_password
            }

            collection.findOne(query, (err, result)=>{
                if(result != null){
                    const objToSend = {
                        user_name: result.user_name, 
                        user_mobile: result.user_mobile
                    }

                    res.status(200).send(JSON.stringify(objToSend))

                } else {
                    res.status(404) //object not found
                }
            })
        })

        const productCollection = myDb.collection('Products')
        app.post('/add_product', (req, res)=>{
            const query = {
                product_name: req.body.product_name,
                product_description: req.body.product_description,
                product_rent_price: req.body.product_rent_price,
                owner_location: req.body.owner_location,
                user_mobile: req.body.user_mobile
            }
            // console.log("QuerryRuN")
            productCollection.insertOne(query, (err, result)=>{
                if(result!=null)
                    res.status(200).send()
                else 
                    res.status(400).send()
            })
        })

        app.post('/get_products', (req, res)=>{
            const query = {
                user_mobile: req.body.user_mobile
            }

           productCollection.find(query).toArray(function(err, docs){
               if(docs!=null){
                    console.log(docs);
                    console.log(JSON.stringify(docs));
                    docs.forEach(function(doc) {
                        console.log(doc.product_name + " is a " + doc.product_description + " company.");
                    });
                    res.status(200).send(JSON.stringify(docs));
               } else {
                 res.status(404) //object not found
               }
           })
           
            // productCollection.findOne(query, (err, result)=>{
            //     console.log("find");
            //     if(result != null){
            //         const objToSend = {
            //             product_name: result.product_name,
            //             product_description: result.product_description,
            //             product_rent_price: result.product_rent_price,
            //             owner_location: result.owner_location, 
            //             user_mobile: result.user_mobile
            //         }
            //         console.log("find");
            //         console.log(JSON.stringify(objToSend));
            //         res.status(200).send(JSON.stringify(objToSend))

            //     } else {
            //         res.status(404) //object not found
            //     }
            // })
        })
    }
})

app.listen(3000, ()=>{
    console.log("Listening on port 3000...")
})

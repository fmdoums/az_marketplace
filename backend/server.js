const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
const PORT = 5000

//mini router de notre appli
const routes = express.Router();
app.use("/api", routes)

//body-parser
routes.use(bodyParser.urlencoded({extended: false}));
routes.use(bodyParser.json());
const jsonParser = bodyParser.json();

//cors
routes.use(cors());

//mongodb Client
const  MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://faciqui:test123@cluster0.aljek.mongodb.net/marketplace?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});

//connect to server
app.listen(PORT, () => {
    console.log(`Server up and running  at http://localhost:${PORT}`)
})

const DATABASE = "marketplace";
const db = client.db(DATABASE);
//connect to DB
client.connect(err => {
    if (err) {
        throw Error(err)
    }

    !err && console.log(`Successfully connected to database`);

  const products = db.collection("products");
  
  // perform actions on the collection object
    routes.get("/products", function (req, res) {
        products
        .find()
        .toArray()
        .then((error, results) => {
            if (error) {
                return res.send(error);
            }
            res.status(200).send({results});
        })
        .catch((err) => res.send(err));
    });

    const exampleObj = {
        id: 29999,
        category: "Clothes",
        name: "Winter Jacket for Women, All sizes",
        price: 79,
    };

    routes.post("/products/add", jsonParser, function (req, res) {
    products
        .insertOne(req.body)
        .then(() => res.status(200).send("successfully inserted new document"))
        .catch((err) => {
        console.log(err);
        res.send(err);
        });
    });



  client.close();
});

routes.get('/', (req, res) => {
    res.send("Hello World!")
})

  

  
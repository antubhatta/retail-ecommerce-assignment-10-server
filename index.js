const express = require('express')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express()
const cors= require('cors')
const port=process.env.PORT || 3000



// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xgdhjcn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productsCollection= client.db('productsDB').collection("products");

    app.get('/products',async(req,res)=>{
        const cursor = productsCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })

    // Get a single product
    app.get("/products/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const product = await productsCollection.findOne(query);
        res.send(product);
    });

        // Create new product
        app.post('/products',async(req,res)=>{
          const newProduct= req.body 
          console.log("added a new product",newProduct)    
           const result = await productsCollection.insertOne(newProduct);
          res.send(result)
  
      })

      // Insert multiple products
      app.post("/products/many", async (req, res) => {
        const data = req.body;
  
        const brand = await productsCollection.insertMany(data);
        return res.json(brand);
      });
      
    // Delete all
    app.delete("/products/all", async (req, res) => {
      const brand = await productsCollection.deleteMany({});
      return res.json(brand);
    });

    // Update a product
    app.patch("/products/:id", async (req, res) => {
        const id = req.params.id;
        const data = req.body;

        console.log(data)

        const filter = { _id: new ObjectId(id) };
        const update = { $set: data };
        const options = { upsert: false };

        const updatedProduct = await productsCollection.updateOne(
          filter,
          update,
          options
        );

        res.send(updatedProduct);
    });

    // Delete all product
    app.delete("/products", async (req, res) => {
      const brand = await productsCollection.deleteMany({});
      return res.json(brand);
    });


     // Brands
     const brandCollection = client.db("productsDB").collection("brand");

     app.get("/brands", async (req, res) => {
         const cursor = brandCollection.find();
         const brands = await cursor.toArray();
         res.send(brands);
     });

     app.get("/brands/:brandName", async (req, res) => {
      const id = req.params.brandName;
      const query = { name: id };

      const product = await brandCollection.findOne(query);
      res.send(product);
  });

 
     app.post("/brands/many", async (req, res) => {
      const data = req.body;

      const brand = await brandCollection.insertMany(data);
      return res.json(brand);
    });
 
     app.get("/brands/:brandName/products", async (req, res) => {
         const name = req.params.brandName;
         const query = { brandName: name };
 
         const products = await productCollection.find(query).toArray();
 
         res.send(products);
     });
 


    // Cart collection
    const cartCollection = client.db("productsDB").collection("Cart");

    app.get("/carts/:userId", async (req, res) => {
        const userId = req.params.userId;
        const query = { userId };

        const data = await cartCollection.find(query).toArray();

        res.send(data);

    });

    app.post("/carts", async (req, res) => {
        const newItem = req.body;
        const { userId, product } = newItem;

        if ((!userId, !product))
          return res.status(400).json({
            status: "error",
            message: "Missing required fields",
          });

        const isExists = await cartCollection.findOne(newItem);
        if (isExists)
          res.status(400).json({
            status: "error",
            message: "Product already exists in the cart",
          });

        const data = await cartCollection.insertOne(newItem);

        res.send(data);

    });

    app.delete("/carts/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };

        const data = await cartCollection.deleteOne(filter);

        res.send(data);
  
    });



    

    


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('retail-e-commerce client server')
})
app.listen(port,(req,res)=>{
    console.log(`retail-e-commerce client: ${port}`)
})
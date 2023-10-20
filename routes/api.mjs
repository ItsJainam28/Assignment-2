import express from "express"
import db from "../db/conn.mjs"
import { ObjectId } from "mongodb"


const router = express.Router()
//API 1
router.get("/products", async(req,res)=>{
    let collection = await db.collection("Product");
    try{
        const result = await collection.find({}).toArray()
        res.send(result);   
    }catch(e){
        res.send("Ops! There was a problem:", e)
    }
    
    
})
//API 2
router.get("/product/:id", async (req, res) => {
    let collection = await db.collection("Product");
    console.log(req.params.id);
    let query = {_id: new ObjectId (req.params.id)};
    console.log(typeof(_id))
    let result = await collection.findOne(query);
    console.log(result)
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).send('Invalid ObjectId');
      return;
    }

    if (!result) {res.send("Not found").status(404);}
    else {res.send(result).status(200);}
  });
//API 3
  router.post("/product", async(req,res)=>{
    let collection = await db.collection("Product")
    const { name, description, price, quantity, category } = req.body;
    
    const newProduct = {
        name,
        description,
        price,
        quantity,
        category,
      };
    
      try{
        const result = await collection.insertOne(newProduct);
        res.status(201).json(result);

      }catch(error){
        res.status(500).send("An error occured while adding the product" + error)
      }
    
});
//API 4
router.put("/product/:id", async (req, res) => {
    try {
     
      const collection = db.collection("Product");
  
     
      let query = {_id: new ObjectId(req.params.id)};

      // Extract the updated data from the request body
      const { name, description, price, quantity, category } = req.body;
  
      // Create an object with the updated data
      const updatedProduct = {
        name,
        description,
        price,
        quantity,
        category,
      };
  
      // Ensure the provided ID is a valid ObjectId
    
      // Update the document in the collection
      const result = await collection.updateOne(
        query,
        { $set: updatedProduct }
      );
      res.send(result).status(200);
     
    } catch (error) {
      console.error(error);
      res.send("An error occurred while updating the product", error).status(500);
    }
   
  });

//API 5
router.delete("/product/:id", async (req, res) => {
    try {
      const productId = req.params.id;
      const collection = db.collection("Product");
  
    
  
      // Delete the document from the collection based on the provided ID
      const result = await collection.deleteOne({ _id: new ObjectId(productId) });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      res.status(204).send(); // Respond with a 204 No Content status (indicating successful deletion)
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while deleting the product");
    }
  });

  //API 6
  router.delete("/product", async (req, res) => {
    try {
      const collection = db.collection("Product");
  
      // Delete all documents from the "Product" collection
      const result = await collection.deleteMany({});
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "No products found" });
      }
  
      res.status(204).send(); // Respond with a 204 No Content status (indicating successful deletion)
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while deleting products");
    }
  });

  //API 7
  router.get("/product/:keyword", async (req, res) => {
    try {
      const keyword = req.params.keyword;
      const collection = db.collection("Product");
  
      // Perform a case-insensitive search for products with names containing the keyword
      const products = await collection.find({
        name: { $regex: keyword, $options: "i" },
      }).toArray();
  
      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send("An error occurred while searching for products");
    }
  });

export default router;
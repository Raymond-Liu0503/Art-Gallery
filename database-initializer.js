const fs = require("fs");
const path = require("path");
const Art = require("./artModel");
const User = require("./userModel");

const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017/";

// Create a new client and connect to MongoDB
const client = new MongoClient(uri);

async function updateArtwork(document, collection) {
  // Update the document with the new attributes
  const updatedDocument = {
    $set: {
      Likes: [],
      reviews: [],
    },
  };

  // Create a filter for this document
  const filter = { _id: document._id };

  // Update the document
  const result = await collection.updateOne(filter, updatedDocument);

}

async function addArtist(document, collection, artCollection) {
  const username = document.Artist;
  try {
    
    const artworks = await artCollection.find({ Artist: username }).toArray();
    const password = "1";
    const newUser = {
      username: username,
      password: password,
      accountType: "artist",
      artworks: artworks,
      liked: [],
      reviews: [],
      notifications: [],
      followers: [],
      following: [],
      createdWorkshops: [],
      joinedWorkshops: [],
    };

    const filter = { username: username };
    const result = await collection.replaceOne(filter, newUser, { upsert: true });
  } catch (error) {
    console.error(`Error creating user ${username}: ${error}`);
  }
}



async function insertDataFromFile(filePath, collection, userCollection) {
    try {
        const rawData = fs.readFileSync(filePath);
        const data = JSON.parse(rawData);

        if (!data || !Array.isArray(data)) {
            throw new Error(`Invalid JSON file format: ${filePath}`);
          }
        
        console.log(`Inserting data from file ${filePath}...`);
        await collection.insertMany(data);

        const documents = await collection.find({}).toArray();

        for (const doc of documents) {
            await updateArtwork(doc, collection);
            await addArtist(doc, userCollection, collection);
        }


        console.log(`Data from file ${filePath} inserted into the collection.`);
        

        
    } catch (error) {
      console.error(`Error inserting data from file ${filePath}:`, error.message);
    }
  }

  async function insertDataFromFolder(folderPath, collection, userCollection) {
    const files = fs.readdirSync(folderPath);
  
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      await insertDataFromFile(filePath, collection, userCollection);
    }
  }
  


// Connect to MongoDB
async function run() {
    try {
        // Connect to the "FinalProject" database
        await client.connect();

        const database = client.db("FinalProject");
        
        let config = {
            _id: "mainpage",
            title: "Welcome to the Gallery",
            description: "This is a gallery of art",
        }

        // Create the "supplies" collection
        await database.createCollection("Gallery");
        await database.createCollection("Users");
        await database.createCollection("config");
        await database.createCollection("Workshops");
        let artCollection = database.collection("Gallery");
        let configCollection = database.collection("config");
        let userCollection = database.collection("Users");
        const jsonFolder = "./gallery";

        // Insert data from JSON files in the folder
        await insertDataFromFolder(jsonFolder, artCollection, userCollection);
        await configCollection.insertOne(config);
  
      console.log('Collection "Gallery" created successfully!');
    } finally {
      // Close the MongoDB client connection
      await client.close();
    }
  }
  
  // Run the function and handle any errors
  run().catch(console.dir);
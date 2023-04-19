const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/pong-game";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = client;

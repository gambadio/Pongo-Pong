const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.json());

const uri = "mongodb+srv://ricardokupper:bongomongo@pong-game.krmfm2k.mongodb.net/pong-game?retryWrites=true&w=majority";


const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect(err => {
  if (err) throw err;
  const db = client.db("pong-game");
  console.log("Connected successfully to MongoDB server");

  const highscoresCollection = db.collection("highscores");

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
  });

  app.get('/api/highscores', (req, res) => {
    highscoresCollection.find().sort({ score: -1 }).toArray((err, result) => {
      if (err) {
        console.error('Error fetching highscores:', err);
        res.status(500).send('Error fetching highscores');
        return;
      }
      res.json(result);
      res.end();
    });
  });

  app.post('/api/highscores', (req, res) => {
    highscoresCollection.insertOne(req.body, (err, result) => {
      if (err) {
        console.error('Error inserting highscore:', err);
        res.status(500).send('Error inserting highscore');
        return;
      }
      res.json(result.ops[0]);
      res.end();
    });
  });

});

app.listen(port, () => {
  console.log(`Server is running and listening on port ${port}`);
}).on('error', (err) => {
  console.error('Error starting the server:', err);
});

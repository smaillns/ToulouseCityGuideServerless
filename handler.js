const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const SPOTS_TABLE = process.env.SPOTS_TABLE;
const VIDEOS_TABLE = process.env.VIDEOS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());


app.get("/spots", async function (req, res) {
  const params = {
    TableName: SPOTS_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.scan(params).promise();
    if (Items) {
      res.json(Items);
    } else {
      res
        .status(404)
        .json({ error: 'Could not fetch data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
});

app.get("/spots/nbr", async function (req, res) {
  const params = {
    TableName: SPOTS_TABLE,
  };

  try {
    const { Count } = await dynamoDbClient.scan(params).promise();
    if (Count) {
      res.json({ nbr: Count});
    } else {
      res
        .status(404)
        .json({ error: 'Could not fetch data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
});



// app.post("/spots", async function (req, res) {
//   const { id, name } = req.body;
//   if (typeof id !== "string") {
//     res.status(400).json({ error: '"Id" must be a string' });
//   } else if (typeof name !== "string") {
//     res.status(400).json({ error: '"name" must be a string' });
//   }

//   const params = {
//     TableName: SPOTS_TABLE,
//     Item: {
//       id: id,
//       categoryName: name,
//     },
//   };

//   try {
//     await dynamoDbClient.put(params).promise();
//     res.json({ id, name });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Could not create user" });
//   }
// });



app.get("/videos", async function (req, res) {
  const params = {
    TableName: VIDEOS_TABLE,
  };

  try {
    const { Items } = await dynamoDbClient.scan(params).promise();
    if (Items) {
      res.json(Items);
    } else {
      res
        .status(404)
        .json({ error: 'Could not fetch data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
});

app.get("/videos/nbr", async function (req, res) {
  const params = {
    TableName: VIDEOS_TABLE,
  };

  try {
    const { Count } = await dynamoDbClient.scan(params).promise();
    if (Count) {
      res.json({ nbr: Count});
    } else {
      res
        .status(404)
        .json({ error: 'Could not fetch data' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
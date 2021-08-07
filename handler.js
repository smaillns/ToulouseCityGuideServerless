const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const SPOTS_TABLE = process.env.SPOTS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/spots/:spotId", async function (req, res) {
  const params = {
    TableName: SPOTS_TABLE,
    Key: {
      id: req.params.spotId,
    },
  };

  try {
    const { Item } = await dynamoDbClient.get(params).promise();
    if (Item) {
      const { userId, name } = Item;
      res.json({ spotId, name });
    } else {
      res
        .status(404)
        .json({ error: 'Could not find user with provided "userId"' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not retreive user" });
  }
});

app.post("/spots", async function (req, res) {
  const { id, name } = req.body;
  if (typeof id !== "string") {
    res.status(400).json({ error: '"Id" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: SPOTS_TABLE,
    Item: {
      id: id,
      categoryName: name,
    },
  };

  try {
    await dynamoDbClient.put(params).promise();
    res.json({ id, name });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
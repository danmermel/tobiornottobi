
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb"); // CommonJS import
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"; // ES6 import
// const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb"); // CommonJS import

// Bare-bones DynamoDB Client
const client = new DynamoDBClient({});

// Bare-bones document client
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client

const TABLE = process.env.TABLE
//console.log("table is ", TABLE)

const HEADERS = { "Content-type": "application/json" }

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}

export const handler = async (event) => {


  if (event.requestContext.http.method !== "POST") {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Must be a POST request" }) }
  }

  var params = {
    TableName: TABLE,
    KeyConditionExpression: 'pk = :pk',
    ExpressionAttributeValues: {
      ':pk': 'profile'
    }
  };
  const command = new QueryCommand(params);


  let response
  response = await ddbDocClient.send(command)

  if (response.$metadata.httpStatusCode === 200) {
    return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ "ok": true, "message": shuffleArray(response.Items) }) }
  } else {
    console.log(response)
    return { statusCode: 500, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Error Retrieving Profiles" }) }
  }
};

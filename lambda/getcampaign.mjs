

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb"); // CommonJS import
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb"; // ES6 import
// const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb"); // CommonJS import

// Bare-bones DynamoDB Client
const client = new DynamoDBClient({});

// Bare-bones document client
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client

const TABLE = process.env.TABLE
//console.log("table is ", TABLE)

const HEADERS = { "Content-type": "application/json" }

export const handler = async (event) => {


  if (event.requestContext.http.method !== "POST") {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Must be a POST request" }) }
  }

  if (!event.body) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "No body found in POST request" }) }
  }
  ////get params validate that all params are there
  const params = JSON.parse(event.body)
  if (!params.campaignid) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Missing mandatory campaignid in request" }) }
  }

  //does the campaign exist?

  let response

  response = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: {
        pk: `campaign#${params.campaignid}`,
        sk: "metadata"
      },
    })
  )
  if (!response.Item) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Invalid campaignid" }) }
  }

  //is it still valid 
  const timenow = new Date().toISOString()
  console.log("time now", timenow)
  console.log("start", response.Item.campaignstart)
  console.log("end", response.Item.campaignend)
  if (timenow < response.Item.campaignstart || timenow > response.Item.campaignend) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Campaign is not currently valid" }) }
  }

  // if you get to this point then the camapign exists and is valid

  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ "ok": true, "message": "Valid Campaign" }) }
}




//campaignid + userid + profileid + votevalue 
//POST

// validate input (are all the values present?)
// fetch campaignid -- does it exist? Is it still current? If not , then 400
// fetch profileid -- does it exist? If not 400  

// insert a new row into the table of votes  
// return ok=true

import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb"); // CommonJS import
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"; // ES6 import
// const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb"); // CommonJS import

// Bare-bones DynamoDB Client
const client = new DynamoDBClient({});

// Bare-bones document client
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client

const TABLE = process.env.TABLE
console.log("table is ", TABLE)

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
  if (!params.campaignid || !params.profileid || !params.userid || typeof params.votevalue == "undefined") {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Missing mandatory parameters in request" }) }
  }

  //does the campaing exist and is still valid?

  const response = await ddbDocClient.send(
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
  if (timenow < response.campaignstart || timenow > response.campaignend) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Campign is not currently valid" }) }
  }


  console.log(response.Item)
  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ "ok": true, "message": response.Item }) }

};






// await ddbDocClient.send(
//   new PutCommand({
//     TableName,
//     Item: {
//       id: "1",
//       content: "content from DynamoDBDocumentClient",
//     },
//   })
// );

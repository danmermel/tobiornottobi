

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

  //does the campaing exist?

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

  //does the profile exist?

  response = await ddbDocClient.send(
    new GetCommand({
      TableName: TABLE,
      Key: {
        pk: "profile",
        sk: params.profileid
      },
    })
  )
  if (!response.Item) {
    return { statusCode: 400, headers: HEADERS, body: JSON.stringify({ "ok": false, "message": "Invalid profileid" }) }
  }

  //if you get here, all is good and you have to write the vote.


  response = await ddbDocClient.send(
    new PutCommand({
      TableName: TABLE,
      Item: {
        pk: `vote#${params.campaignid}`,
        sk: `${params.profileid}#${params.userid}`,
        campaignid: params.campaignid,
        userid: params.userid,
        profileid: params.profileid,
        vote: params.votevalue,
        timestamp: new Date().toISOString,
        GSI1PK: `profile#${params.profileid}`,
        GSI1SK: `user#${params.userid}`
      },
    })
  );

  return { statusCode: 200, headers: HEADERS, body: JSON.stringify({ "ok": true, "message": response }) }

};

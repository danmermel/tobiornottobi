
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES6 import
// const { DynamoDBClient } = require("@aws-sdk/client-dynamodb"); // CommonJS import
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb"; // ES6 import
// const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb"); // CommonJS import

// Bare-bones DynamoDB Client
const client = new DynamoDBClient({});

// Bare-bones document client
const ddbDocClient = DynamoDBDocumentClient.from(client); // client is DynamoDB client

const TABLE = process.env.TABLE
//console.log("table is ", TABLE)

const HEADERS = { "Content-type": "application/json" }

export const handler = async (event) => {

  for (var i = 0; i < event.Records.length; i++) {
    const record = event.Records[i]
    // console.log(i)
    // console.log("NEW Image is: ", record.dynamodb.NewImage)
    // console.log("OLD Image is: ", record.dynamodb.OldImage)
    const newimage = record.dynamodb.NewImage
    const oldimage = record.dynamodb.OldImage

    const pk = newimage ? newimage.profileid.S : oldimage.profileid.S
    const sk = newimage ? newimage.campaignid.S : oldimage.campaignid.S

    // Now try to load the row

    let params = {
      TableName: TABLE,
      Key: {
        pk,
        sk
      }
    };

    // console.log(params)

    let row = await ddbDocClient.send(
      new GetCommand(params)
    )

    // console.log("This is the row: ", row.Item)
    let item

    if (!row.Item) {
      //the agg row does not yet exist.. create it
      item = {
        pk,
        sk,
        yes: 0,
        no: 0
      }
    } else {
      item = row.Item
    }

    // console.log("The item is ", item)
    // if there is a newimage add one to whatever was chosen

    if (newimage) {
      // console.log("new image exists and vote is ", newimage.vote.BOOL )
      if (newimage.vote.BOOL) {
        item.yes++
      } else {
        item.no++
      }
    }
    //if there is an oldimage subtract one from what was in the old image

    if (oldimage) {
      // console.log("old image exists and vote is ", oldimage.vote.BOOL )
      if (oldimage.vote.BOOL) {
        item.yes--
      } else {
        item.no--
      }
    }

    //write the row back 
    // console.log("We are about to write this: ", item)

    await ddbDocClient.send(
      new PutCommand({
        TableName: TABLE,
        Item: item
      })
    )
  }
};

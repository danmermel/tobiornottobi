module "writeVote" {
  source        = "./modules/apicall"
  function_name = "writevote"
  role          = aws_iam_role.tobiLambdaRole.arn
  nodeLayer     = aws_lambda_layer_version.tobiLambdaLayer.arn

  env_variables = {
    TABLE = aws_dynamodb_table.tobiDb.id
  }
}



output "writeVoteFunctionUrl" {
  value = module.writeVote.url
}


module "getProfiles" {
  source        = "./modules/apicall"
  function_name = "getprofiles"
  role          = aws_iam_role.tobiLambdaRole.arn
  nodeLayer     = aws_lambda_layer_version.tobiLambdaLayer.arn

  env_variables = {
    TABLE = aws_dynamodb_table.tobiDb.id
  }
}

output "getProfilesFunctionUrl" {
  value = module.getProfiles.url
}


module "getCampaign" {
  source        = "./modules/apicall"
  function_name = "getcampaign"
  role          = aws_iam_role.tobiLambdaRole.arn
  nodeLayer     = aws_lambda_layer_version.tobiLambdaLayer.arn

  env_variables = {
    TABLE = aws_dynamodb_table.tobiDb.id
  }
}

output "getCampaignFunctionUrl" {
  value = module.getCampaign.url
}


module "aggregate" {
  source        = "./modules/apicall"
  function_name = "aggregate"
  role          = aws_iam_role.tobiLambdaRole.arn
  nodeLayer     = aws_lambda_layer_version.tobiLambdaLayer.arn

  env_variables = {
    TABLE = aws_dynamodb_table.tobiAgg.id
  }
}

resource "aws_lambda_event_source_mapping" "aggMapping" {
  event_source_arn  = aws_dynamodb_table.tobiDb.stream_arn
  function_name     = module.aggregate.arn
  starting_position = "LATEST"
}
module "writeVote" {
  source        = "./modules/apicall"
  function_name = "writevote"
  role          = aws_iam_role.tobiLambdaRole.arn
  nodeLayer         = aws_lambda_layer_version.tobiLambdaLayer.arn
}


output "writeVoteFunctionUrl" {
  value = module.writeVote.url
}
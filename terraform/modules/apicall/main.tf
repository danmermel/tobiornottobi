data "archive_file" "lambda" {
  source_dir  = "../lambda"
  type     = "zip"
  output_path = "../lambda.zip"
  excludes = [ "node_modules", "nodejs", "nodejs-stage.zip", "nodejs-prod.zip"]
}

resource "aws_lambda_function" "tobiLambda" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "${var.function_name}-${terraform.workspace}"
  role             = var.role
  handler          = "${var.function_name}.handler"
  runtime          = var.runtime
  timeout          = var.timeout
  source_code_hash = data.archive_file.lambda.output_base64sha256
  layers           = [var.nodeLayer]
  reserved_concurrent_executions = 1
  environment {
    variables = var.env_variables
  }
}

resource "aws_cloudwatch_log_group" "tobiLG" {
  name              = "/aws/lambda/${var.function_name}-${terraform.workspace}"
  retention_in_days = 7
}

resource "aws_lambda_function_url" "tobiFunctionUrl" {
  function_name      = aws_lambda_function.tobiLambda.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    max_age           = 86400
  }
}

output "url" {
  value = aws_lambda_function_url.tobiFunctionUrl.function_url
}
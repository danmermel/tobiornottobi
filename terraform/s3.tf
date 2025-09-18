resource "aws_s3_bucket" "tobiLambdaCode" {
  bucket = "tobi-lambda-code-${terraform.workspace}"
}
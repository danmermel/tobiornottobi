resource "aws_iam_role" "tobiLambdaRole" {
  name = "tobiLambdaRole-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

//add inline policy that allows writing to logs and invoking lambda functions

resource "aws_iam_role_policy" "tobiInlinePolicy" {
  name = "rssInlinePolicy-${terraform.workspace}"
  role = aws_iam_role.tobiLambdaRole.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": "arn:aws:logs:*:*:*"
            },
            { 
                "Effect": "Allow", 
                "Action": [ "lambda:InvokeFunction" ], 
                "Resource": ["*"]
	    },
            {
                "Effect": "Allow",
                "Action": [ "dynamodb:*" ],
                "Resource": ["arn:aws:dynamodb:*:*:table/*"]
            }
        ]
  }
  EOF
}
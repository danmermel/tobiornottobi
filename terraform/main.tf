terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.13"
    }
  }
  backend "s3" {
    bucket = "danmermel-terraform"
    key    = "tobiornottobi/terraform.tfstate"
    region = "eu-west-1"
  }
}
provider "aws" {
  region = "eu-west-1"
}

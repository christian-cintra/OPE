provider "aws" {
  region     = var.region
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  backend "s3" {}
}

data "aws_ami" "centos" {
  owners      = ["679593333241"]
  most_recent = true

  filter {
    name   = "name"
    values = ["CentOS Linux 7 x86_64 HVM EBS *"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

module "default_aws_networking" {
  source  = "terraform-aws-modules/vpc/aws"

  name    = "${var.env}-cintra-instalacoes-vpc"
  cidr    = var.cidr

  azs     = var.azs
  public_subnets = [
      for index in var.num_subnets:
          cidrsubnet(var.cidr, 8, index) 
  ]

  private_subnets  = [
      for index in var.num_subnets:
          cidrsubnet(var.cidr, 8, index + length(var.num_subnets))
  ]

  database_subnets  = [
      for index in var.num_subnets:
          cidrsubnet(var.cidr, 8, index + 30)
  ]

  single_nat_gateway   = var.single_nat_gateway
  enable_nat_gateway   = true
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  elasticache_subnet_suffix = "cache"
  create_database_subnet_group           = var.enable_database_subnet_group
  create_database_subnet_route_table     = var.enable_database_subnet_route_table
  create_database_internet_gateway_route = var.enable_database_public_subnets

  tags = {
    Name = "${var.env}-cintra-instalacoes-sg"
  }
}

module "default_key_pair" {
  source = "git::ssh://git@bitbucket.org/datenworks/tf-modules.git//aws-key-pair?ref=master"
  name   = "${var.region}-${var.env}-default"
}

resource "aws_security_group" "default" {
  name   = "${var.env}-cintra-instalacoes-sg"
  vpc_id = module.default_aws_networking.vpc_id

  ingress {
    from_port   = 0
    to_port     = 65534
    protocol    = "tcp"
    cidr_blocks = [module.default_aws_networking.vpc_cidr_block]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.env}-cintra-instalacoes-sg"
  }
}
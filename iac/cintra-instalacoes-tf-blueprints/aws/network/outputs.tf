# VPC
output "vpc_id" {
  description = "The ID of the VPC"
  value       = module.default_aws_networking.vpc_id
}

# CIDR blocks
output "vpc_cidr_block" {
  description = "The CIDR block of the VPC"
  value       = module.default_aws_networking.vpc_cidr_block
}

# Subnets
output "private_subnets" {
  description = "List of IDs of private subnets"
  value       = module.default_aws_networking.private_subnets
}

output "public_subnets" {
  description = "List of IDs of public subnets"
  value       = module.default_aws_networking.public_subnets
}

output "database_subnets" {
  description = "List of IDs of database subnets"
  value = module.default_aws_networking.database_subnets
}

output "rds_subnet_group_name" {
  value = module.default_aws_networking.database_subnet_group_name
}

# NAT gateways
output "nat_public_ips" {
  description = "List of public Elastic IPs created for AWS NAT Gateway"
  value       = module.default_aws_networking.nat_public_ips
}

# AZs
output "azs" {
  description = "A list of availability zones spefified as argument to this module"
  value       = module.default_aws_networking.azs
  
}

# Default SG
output "default_security_group" {
  value = aws_security_group.default.id
}

# Key Name
output "key_name" {
  description = "Created SSH key name"
  value = module.default_key_pair.key_name
}
variable "env" {
  description = "Environment Tag QA or PRD"
}

variable "region" {
  description = "Provider Region"
  type = string
}


variable "cidr" {
  type        = string
  description = "The CIDR of the VPC"
}

variable "azs" {
  type        = list(string)
  description = "List of Avaibility Zones"
}

variable "num_subnets" {
  type        = list(number)
  description = "List of 8-bit numbers of subnets of base_cidr_block that should be granted access."
  default     = [1, 2, 3]
}

variable "enable_database_subnet_group" {
  description = "Create database subnet group"    
  default = true    
  type = bool  
}

variable "enable_database_subnet_route_table" {
  description = "Create route table for database subnet group"
  default = true
  type = bool
}

variable "enable_database_public_subnets" {
  description = "Enable database subnet group public access"
  default = false
  type = bool
}

variable "single_nat_gateway" {
  description = "Enable single nat for all private subnets"
  default = false
  type = bool
}

# variable "database_subnets" {
#   type = list(string)
# }
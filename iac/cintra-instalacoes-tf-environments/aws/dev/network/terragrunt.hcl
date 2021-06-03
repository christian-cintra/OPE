include {
  path = "${find_in_parent_folders()}"
}

terraform {
  source = "git@github.com:ClaudioToledoGHT/OPE/iac/cintra-instalacoes-tf-blueprints.git//aws/network?ref=master"
}

inputs = {
  cidr                               = "10.0.0.0/16"
  azs                                = ["us-east-1a", "us-east-1b", "us-east-1c", "us-west-1"]
  num_subnets                        = [1, 2]
  enable_openvpn                     = false
  enable_database_subnet_route_table = false
  enable_database_subnet_group       = true
  enable_database_public_subnets     = false
  single_nat_gateway                 = true
}
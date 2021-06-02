remote_state {
  backend = "s3"
  config = {
    region         = "us-east-1"
    bucket         = "cintra-instalacoes-tf-state"
    key            = "${path_relative_to_include()}/terraform.tfstate"
  }
}

terraform {
  extra_arguments "terragrunt_generated_vars" {
    commands = get_terraform_commands_that_need_vars()

    required_var_files = [
      "${find_in_parent_folders("environment.tfvars")}"
    ]
  }
}
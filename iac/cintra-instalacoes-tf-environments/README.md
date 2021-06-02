# Terraform Environments

Ambientes provisionados via Terragrunt e Terraform.

## Requisitos

| **Terraform**  | **Terragrunt**    | 
|----------------|-------------------|
| `version 13.5` | `version v0.23.4` |

## Ambientes

| **Ambiente**  | **Região**   | **CIDR da VPC**  | **Descrição**   |
|---------------|--------------|------------------|-----------------|
|     `dev`     | `          ` | `              ` | Dev (region)  |
|     `prd`     | `          ` | `             `  | Prod (region) |

## Estrutura de diretórios

A seguinte estrutura de diretórios é utilizada neste repositório:

```
terraform-environments/
└── <provider>/                         # Cloud provider (gcp, aws, etc)
    └── <ambiente>/                     # Nome do ambiente (staging, production, etc)
        ├── terragrunt.hcl              # Configuração do Terragrunt (bucket de state, comandos extras, etc)
        ├── environment.tfvars          # Variáveis usadas em *todas* as blueprints do *ambiente*
        └── <blueprint>/                # Nome da blueprint (componente) do ambiente (vpc, rds-mysql, app1, etc)
            └── terragrunt.hcl          # Configuração do componente (Terragrunt, repositório e variáveis da Blueprint, etc)
```

Exemplo:

```
terraform-environments/
└── aws/
    └── prd/
        ├── terragrunt.hcl
        ├── environment.tfvars
        └── network/
            └── terragrunt.hcl
```


## Deploy

Para realizar a implantação das aplicações é necessário seguir os seguinte passos:

 * Acessar a pasta do ambiente **[cloud]/[AMBIENTE]**
 * Acessar uma pasta de aplicações **network**
 * Acessar a pasta da aplicação que será feito deploy
 * Configurar as credenciais necessárias:
 *      Huawei cloud (OS_ACCESS_KEY='' OS_SECRET_ACCESS='' OS_REGION_NAME='la-south-2')
 *      Google cloud (OS_ACCESS_KEY='' OS_SECRET_ACCESS='' OS_REGION_NAME='')
 *      AWS (AWS_PROFILE='')
 * Após isso execute `terragrunt plan`
 * Verifique os recursos a serem criados, e então execute `terragrunt apply`

Pronto! Agora você ja tem a infraestrutura da sua aplicação implantada.

## Help and Support

[![DatenWorks](https://datenworks.com/wp-content/themes/datenworks/img/logo.png)](https://www.datenworks.com/)
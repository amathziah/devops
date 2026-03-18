variable "backend_image" {
  description = "Docker image for backend"
  type        = string
  default     = "ghcr.io/amathziah/devops/backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
  default     = "ghcr.io/amathziah/devops/frontend:latest"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "shopsmart"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "backend_port" {
  description = "External port for backend"
  type        = number
  default     = 5000
}

variable "frontend_port" {
  description = "External port for frontend"
  type        = number
  default     = 3000
}

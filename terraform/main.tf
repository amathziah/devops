terraform {
  required_version = ">= 1.0.0"
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

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

resource "docker_image" "backend" {
  name         = var.backend_image
  keep_locally = false
}

resource "docker_image" "frontend" {
  name         = var.frontend_image
  keep_locally = false
}

resource "docker_network" "private_network" {
  name = "shopsmart_network"
}

resource "docker_container" "backend" {
  image = docker_image.backend.image_id
  name  = "shopsmart-backend-prod"
  networks_advanced {
    name = docker_network.private_network.name
  }
  ports {
    internal = 5000
    external = 5000
  }
  restart = "unless-stopped"
}

resource "docker_container" "frontend" {
  image = docker_image.frontend.image_id
  name  = "shopsmart-frontend-prod"
  networks_advanced {
    name = docker_network.private_network.name
  }
  ports {
    internal = 80
    external = 3000
  }
  restart = "unless-stopped"
}

output "backend_url" {
  value = "http://localhost:5000"
}

output "frontend_url" {
  value = "http://localhost:3000"
}

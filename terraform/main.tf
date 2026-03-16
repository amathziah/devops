terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0.1"
    }
  }
}

provider "docker" {}

resource "docker_image" "backend" {
  name         = "ghcr.io/amathziah/devops/backend:latest"
  keep_locally = false
}

resource "docker_image" "frontend" {
  name         = "ghcr.io/amathziah/devops/frontend:latest"
  keep_locally = false
}

resource "docker_container" "backend" {
  image = docker_image.backend.image_id
  name  = "shopsmart-backend-tf"
  ports {
    internal = 5000
    external = 5000
  }
}

resource "docker_container" "frontend" {
  image = docker_image.frontend.image_id
  name  = "shopsmart-frontend-tf"
  ports {
    internal = 80
    external = 3000
  }
}

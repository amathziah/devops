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

locals {
  full_project_name = "${var.project_name}-${var.environment}"
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
  name = "${local.full_project_name}_network"
}

resource "docker_container" "backend" {
  image = docker_image.backend.image_id
  name  = "${local.full_project_name}-backend"
  networks_advanced {
    name = docker_network.private_network.name
  }
  ports {
    internal = 5000
    external = var.backend_port
  }
  restart = "unless-stopped"
}

resource "docker_container" "frontend" {
  image = docker_image.frontend.image_id
  name  = "${local.full_project_name}-frontend"
  networks_advanced {
    name = docker_network.private_network.name
  }
  ports {
    internal = 80
    external = var.frontend_port
  }
  restart = "unless-stopped"
}

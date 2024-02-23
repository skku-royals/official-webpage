#!/bin/bash
sudo yum update -y
sudo yum install docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
docker run --name postgres -e POSTGRES_PASSWORD=${postgres_password} -d -p 5432:5432 postgres:15

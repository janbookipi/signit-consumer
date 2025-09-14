#!/bin/bash

is_just_installed() {
  if hash just 2>/dev/null
  then
    echo "Just is already installed. Continuing..."
    return 0
  else
    return 1
  fi
}

if ! is_just_installed; then
  echo "Installing pre-requisites for ci-dev"

  if [ "$(uname)" == "Darwin" ]; then
    brew install just
  else
    # TODO: currently it supports ubuntu/debian only
    wget -qO - 'https://proget.makedeb.org/debian-feeds/prebuilt-mpr.pub' | gpg --dearmor | sudo tee /usr/share/keyrings/prebuilt-mpr-archive-keyring.gpg 1> /dev/null
    echo "deb [arch=all,$(dpkg --print-architecture) signed-by=/usr/share/keyrings/prebuilt-mpr-archive-keyring.gpg] https://proget.makedeb.org prebuilt-mpr $(lsb_release -cs)" | sudo tee /etc/apt/sources.list.d/prebuilt-mpr.list
    sudo apt update
    sudo apt install just
  fi
fi

if [ "$(uname)" == "Darwin" ]; then
  echo "is mac"
else
  # Init Docker credential
  sudo apt install gnupg2
  gpg --batch --passphrase '' --quick-gen-key ${USER} default default
  pass init "${USER}"
  # Install cypress dependencies
  sudo apt-get install libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb
fi

# Login AWS to access private images
echo "Setting up AWS ECR..."
export ECR_REGISTRY=643881632969.dkr.ecr.ap-southeast-2.amazonaws.com
docker logout $ECR_REGISTRY

echo "Logging into AWS ECR..."
aws ecr get-login-password --region ap-southeast-2 | docker login --username AWS --password-stdin $ECR_REGISTRY

# Setup the environment
just setup

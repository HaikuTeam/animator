#!/usr/bin/env bash

echo "building with provided cert"

CSC_LINK=file://$HOME/Certificates/DeveloperIdApplicationMatthewB73M94S23A.p12
CSC_KEY_PASSWORD=$(cat $HOME/Certificates/DeveloperIdApplicationMatthewB73M94S23A.p12.password)

./node_modules/.bin/build --mac

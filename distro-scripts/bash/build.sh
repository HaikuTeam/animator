#!/usr/bin/env bash

echo "building with provided cert"
# this is kept in a .sh file instead of an npm script so we can exclude these
# secrets from the final build package.
CSC_LINK=file://$PWD/certs/DeveloperIdApplicationMatthewB73M94S23A.p12
CSC_KEY_PASSWORD=cN3cD4gH6kJ9M56
./node_modules/.bin/build --mac

#!/bin/bash

# Load the latest version from package.json using awk
LATEST_VERSION=$(awk -F'"' '/"version"/ {print $4}' ./package.json)
echo "Latest version from package.json: $LATEST_VERSION"

if [ -z "$BUILD_ENV" ]; then
  if [ "$REACT_APP_ISDEV" = "true" ]; then
      echo "Running in development mode"
      DEPLOY_ENV='dev'
  else
      echo "REACT_APP_ISDEV is not defined. Defaulting to prod mode."
      DEPLOY_ENV='prod'
  fi
else
  DEPLOY_ENV="$BUILD_ENV"
fi
VERSION_FILE_URL="s3://bookipi/versions/web/$DEPLOY_ENV.txt"
echo "Updating S3 Version File: $VERSION_FILE_URL"

# Upload the latest version to S3
UPLOAD_CMD="echo \"$LATEST_VERSION\" | aws s3 cp - ${VERSION_FILE_URL} --content-type \"text/plain\""

echo "Executing: $UPLOAD_CMD"
eval $UPLOAD_CMD

if [ $? -ne 0 ]; then
echo "Error uploading version file. Proceeding with the pipeline, but this step failed."
else
    echo "Version file uploaded successfully."
fi
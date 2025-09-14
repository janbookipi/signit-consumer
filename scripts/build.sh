if [ -z "$BUILD_ENV" ]; then
  if [ "$REACT_APP_ISDEV" = "true" ]
  then
    export BUILD_ENV='dev'
  else
    export BUILD_ENV='prod'
  fi
fi

echo "Running build for $BUILD_ENV"

yarn build:frontend
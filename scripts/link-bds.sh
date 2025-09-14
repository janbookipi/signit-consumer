#!/bin/bash

# Symlinking BDS React Dependencies for local development
# Usage: ./link-bds.sh [link|unlink] --bds-path "wherever/payroller-web-partial/packages/bds"

# When linking BDS, duplicated React in Bookipi Web App and BDS causes issues. This script symlinks React dependencies to BDS to prevent it.
# reference: https://medium.com/bbc-product-technology/solving-the-problem-with-npm-link-and-react-hooks-266c832dd019


BDS_PATH=''
BOOKIPI_PATH="$(dirname "$(realpath "$0")")"

OPERATION=$1
shift

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --bds-path) BDS_PATH="$2"; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# Check if BDS_PATH is provided
if [ -z "$BDS_PATH" ]; then
    echo "You must specify the BDS_PATH using --bds-path"
    exit 1
fi

if [ "$OPERATION" = "link" ]; then
  echo "Linking BDS.."
  # Step 1: Register BDS
  cd "$BDS_PATH"
  yarn link

  # Step 2: Register React dependencies to BDS
  cd "$BOOKIPI_PATH/node_modules/react"
  yarn link
  cd "$BOOKIPI_PATH/node_modules/react-dom"
  yarn link
  cd "$BOOKIPI_PATH/node_modules/framer-motion"
  yarn link
  cd "$BDS_PATH"
  yarn link react
  yarn link react-dom
  yarn link framer-motion

  # Step 3: Use linked BDS in Bookipi Web App
  cd "$BOOKIPI_PATH"
  yarn link @bookipi/bds

  echo "BDS and React dependencies have been linked successfully."

elif [ "$OPERATION" = "unlink" ]; then
    echo "Unlinking BDS..."
    # Reverse Step 3: Unlink BDS in Bookipi Web App
    cd "$BOOKIPI_PATH"
    yarn unlink @bookipi/bds

    # Setp 1: Unlink React dependencies in BDS
    cd "$BDS_PATH"
    yarn unlink react
    yarn unlink react-dom
    yarn unlink framer-motion

    # Step 2: Unregister React dependencies
    cd "$BOOKIPI_PATH/node_modules/react"
    yarn unlink
    cd "$BOOKIPI_PATH/node_modules/react-dom"
    yarn unlink
    cd "$BOOKIPI_PATH/node_modules/framer-motion"
    yarn unlink

    # Step 3: Unregister BDS
    cd "$BDS_PATH"
    yarn unlink

    echo "BDS and React dependencies have been unlinked successfully."

else
    echo "Invalid argument. Please use 'link' or 'unlink'."
    exit 1
fi
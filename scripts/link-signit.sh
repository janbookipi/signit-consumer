#!/bin/bash

# Symlinking Signit React Dependencies for local development
# Usage: ./link-signit.sh [link|unlink] --signit-path "wherever/signit/packages"

# This script symlinks React dependencies to Signit to prevent it.
# reference: https://medium.com/bbc-product-technology/solving-the-problem-with-npm-link-and-react-hooks-266c832dd019


SIGNIT_PATH=''
BOOKIPI_PATH="$(dirname "$(realpath "$0")")"

OPERATION=$1
shift

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --signit-path) SIGNIT_PATH="$2"; shift ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
    shift
done

# Check if SIGNIT_PATH is provided
if [ -z "$SIGNIT_PATH" ]; then
    echo "You must specify the SIGNIT_PATH using --signit-path"
    exit 1
fi

if [ "$OPERATION" = "link" ]; then
  echo "Linking Signit packages.."
  # Step 1: Register Signit
  cd "$SIGNIT_PATH/common-react"
  yarn link

  cd "$SIGNIT_PATH/contract-create"
  yarn link
  
  cd "$SIGNIT_PATH/contract-view"
  yarn link

  # Step 2: Register React dependencies to Signit
  echo "Linking React dependencies to Signit.."
  cd "$BOOKIPI_PATH/node_modules/react"
  yarn link
  cd "$BOOKIPI_PATH/node_modules/react-dom"
  yarn link
  
  cd "$SIGNIT_PATH/common-react"
  yarn link react
  yarn link react-dom
  
  cd "$SIGNIT_PATH/contract-create"
  yarn link react
  yarn link react-dom
  
  cd "$SIGNIT_PATH/contract-view"
  yarn link react
  yarn link react-dom
  

  # Step 3: Use linked Signit in Bookipi Web App
  cd "$BOOKIPI_PATH"
  yarn link @bookipi/signit-common-react @bookipi/signit-contract-create @bookipi/signit-contract-view

  echo "Signit and React dependencies have been linked successfully."

elif [ "$OPERATION" = "unlink" ]; then
    echo "Unlinking Signit..."
    # Reverse Step 3: Unlink Signit in Bookipi Web App
    cd "$BOOKIPI_PATH"
    yarn unlink @bookipi/signit-common-react @bookipi/signit-contract-create @bookipi/signit-contract-view

    # Setp 1: Unlink React dependencies in Signit
    cd "$SIGNIT_PATH/common-react"
    yarn unlink react
    yarn unlink react-dom
    
    cd "$SIGNIT_PATH/contract-create"
    yarn unlink react
    yarn unlink react-dom

    cd "$SIGNIT_PATH/contract-view"
    yarn unlink react
    yarn unlink react-dom

    # Step 2: Unregister React dependencies
    cd "$BOOKIPI_PATH/node_modules/react"
    yarn unlink
    cd "$BOOKIPI_PATH/node_modules/react-dom"
    yarn unlink
    

    # Step 3: Unregister Signit
    cd "$SIGNIT_PATH/common-react"
    yarn unlink

    cd "$SIGNIT_PATH/contract-create"
    yarn unlink

    cd "$SIGNIT_PATH/contract-view"
    yarn unlink

    echo "Signit and React dependencies have been unlinked successfully."

else
    echo "Invalid argument. Please use 'link' or 'unlink'."
    exit 1
fi
#!/bin/bash
# Adyen React Online Payments - Example Runner Script
set -euo pipefail

# Check environment variables
if [ -z "${ADYEN_HMAC_KEY+x}" ] || [[ -z "${ADYEN_API_KEY+x}" ]] || [[ -z "${REACT_APP_ADYEN_CLIENT_KEY+x}" ]] || [[ -z "${ADYEN_MERCHANT_ACCOUNT+x}" ]]; then
    echo "Expected environment variables not found."
    echo "Please set the following environment variables:"
    echo "   - ADYEN_HMAC_KEY"
    echo "   - ADYEN_API_KEY"
    echo "   - REACT_APP_ADYEN_CLIENT_KEY"
    echo "   - ADYEN_MERCHANT_ACCOUNT"
    echo ""
    echo "In Codespaces, you can set them via:"
    echo "   1. Create a .env file in the project root (recommended)"
    echo "   2. Export them in the terminal"
    exit 1
fi

echo "Starting Adyen React Online Payments server..."
npm run server


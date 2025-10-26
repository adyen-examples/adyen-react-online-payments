#!/bin/bash
# Adyen React Online Payments - Codespaces Setup Script
set -euo pipefail

echo "Setting up Adyen React Online Payments..."

# Install dependencies
echo "Installing dependencies..."
npm install

echo "Setup complete!"
echo ""
echo "Please set the following environment variables before running the server:"
echo "   - ADYEN_API_KEY"
echo "   - ADYEN_MERCHANT_ACCOUNT"
echo "   - ADYEN_HMAC_KEY"
echo "   - REACT_APP_ADYEN_CLIENT_KEY"
echo ""
echo "To set environment variables in Codespaces:"
echo "1. Create a .env file in the project root with your credentials"
echo "2. Or use: export VARIABLE_NAME='value' in the terminal"
echo ""
echo "To start the server, run: npm run server"


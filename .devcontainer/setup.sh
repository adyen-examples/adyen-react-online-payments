#!/bin/bash
# Adyen React Online Payments - Codespaces Setup Script
set -euo pipefail

echo "Setting up Adyen React Online Payments..."

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "Setup complete!"
echo ""
echo "Before running the server, set the following environment variables:"
echo "   - ADYEN_API_KEY"
echo "   - ADYEN_MERCHANT_ACCOUNT"
echo "   - ADYEN_HMAC_KEY"
echo "   - REACT_APP_ADYEN_CLIENT_KEY"
echo ""
echo "You can set these by:"
echo "   1. Creating a .env file in the project root"
echo "   2. Using Codespace secrets (Settings → Secrets and variables)"
echo "   3. Exporting them in the terminal"
echo ""
echo "Then run: npm run server"


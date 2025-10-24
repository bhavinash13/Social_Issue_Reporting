#!/bin/bash

echo "Starting Social Issues Platform..."
echo

echo "Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo
echo "Installing frontend dependencies..."
cd ../client
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Setup complete!"
echo
echo "To start the application:"
echo "1. Backend: cd server && npm run dev"
echo "2. Frontend: cd client && npm run dev"
echo
echo "Demo accounts:"
echo "- User: user@demo.com / demo123"
echo "- Admin: admin@demo.com / demo123"
echo
#!/bin/bash

echo "🚀 Starting ChamaTrust Working Server..."

# Kill any existing process on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null

# Wait a moment
sleep 2

# Start the working server
echo "🔧 Starting server on port 5000..."
node working-server.js

echo "✅ Server started successfully!"
echo "📊 Admin endpoints available at:"
echo "  - http://localhost:5000/api/health"
echo "  - http://localhost:5000/api/admin/stats"
echo "  - http://localhost:5000/api/admin/users"
echo "  - http://localhost:5000/api/admin/loans"
echo "  - http://localhost:5000/api/loans/:id/approve"

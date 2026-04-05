#!/bin/bash
echo "🚀 Starting ChamaTrust Full Stack..."

# Start backend in background
echo "Starting backend..."
cd Server
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting frontend..."
cd ../Client
npm run dev &
FRONTEND_PID=$!

echo "✅ Full stack started!"
echo "📊 Backend: http://localhost:5000"
echo "🎨 Frontend: http://localhost:5173"
echo "🏥 Health Check: http://localhost:5000/api/health"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID" INT
wait

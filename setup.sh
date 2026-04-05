#!/bin/bash

# ChamaTrust Setup Script
# This script sets up the entire ChamaTrust development environment

echo "🚀 Setting up ChamaTrust Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Create database
echo "📊 Creating PostgreSQL database..."
createdb chamatrust 2>/dev/null || echo "Database already exists"

# Setup backend
echo "🔧 Setting up backend..."
cd Server

# Install dependencies
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init || echo "Migrations may have already been applied"

# Seed database
echo "🌱 Seeding database..."
npm run seed || node scripts/seed.js

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd Client

# Install dependencies
npm install

# Create environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    echo "VITE_API_URL=http://localhost:5000" > .env
fi

cd ..

# Create Docker configuration
echo "🐳 Setting up Docker configuration..."
cat > docker-compose.yml << EOF
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: chamatrust
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./Server
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/chamatrust
    volumes:
      - ./Server:/app
      - /app/node_modules

  frontend:
    build: ./Client
    ports:
      - "5173:5173"
    depends_on:
      - backend
    volumes:
      - ./Client:/app
      - /app/node_modules

volumes:
  postgres_data:
EOF

# Create development scripts
echo "📜 Creating development scripts..."

# Backend start script
cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting ChamaTrust Backend..."
cd Server
npm run dev
EOF

# Frontend start script
cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting ChamaTrust Frontend..."
cd Client
npm run dev
EOF

# Full stack start script
cat > start-all.sh << 'EOF'
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
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh start-all.sh

# Create gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment variables
.env
.env.local
.env.*.local

# Build outputs
dist/
build/
*/dist/
*/build/

# Logs
logs/
*.log
npm-debug.log*

# Database
*.db
*.sqlite

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Stellar
*.stellar
stellar_keys.txt
*.wasm
EOF
fi

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Update Server/.env with your configuration"
echo "2. Run './start-all.sh' to start the full application"
echo "3. Visit http://localhost:5173 to access ChamaTrust"
echo ""
echo "📚 Useful commands:"
echo "- ./start-backend.sh    - Start backend only"
echo "- ./start-frontend.sh   - Start frontend only"
echo "- ./start-all.sh        - Start full stack"
echo "- docker-compose up    - Start with Docker"
echo ""
echo "🔗 URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:5000"
echo "- Health Check: http://localhost:5000/api/health"
echo "- Prisma Studio: cd Server && npx prisma studio"
echo ""
echo "🎉 Happy coding with ChamaTrust!"

#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  ForgeLink Development Setup${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to print colored messages
print_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# 1. Check Python
print_step "Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    print_error "Python3 not found. Please install Python 3.10 or higher."
    exit 1
fi
print_success "Python3 found: $(python3 --version)"

# 2. Check if virtual environment exists
print_step "Setting up Python virtual environment..."
if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    print_success "Virtual environment created"
else
    print_success "Virtual environment already exists"
fi

# 3. Activate virtual environment
source .venv/bin/activate
print_success "Virtual environment activated"

# 4. Upgrade pip
print_step "Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1
print_success "pip upgraded"

# 5. Install backend dependencies
print_step "Installing backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

# 6. Setup .env file
print_step "Setting up .env configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success ".env file created from .env.example"
    print_warning "Please edit .env with your database credentials if needed"
else
    print_success ".env file already exists"
fi

# 7. Database migration info
print_step "Database Migration Info"
echo -e "${YELLOW}Before running migrations, ensure PostgreSQL is running with correct credentials in .env${NC}"
echo -e "${YELLOW}If you want to use SQLite for development, you can modify the DATABASES setting.${NC}"

# 8. Check Node.js
print_step "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_warning "Node.js not found. You'll need to install it for the frontend."
    print_warning "Download from: https://nodejs.org/"
else
    print_success "Node.js found: $(node --version)"

    # 9. Install frontend dependencies
    print_step "Installing frontend dependencies..."
    cd frontend
    npm install > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
    else
        print_error "Failed to install frontend dependencies"
        cd ..
        exit 1
    fi
    cd ..
fi

# 10. Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Setup completed successfully!${NC}"
echo -e "${BLUE}========================================${NC}"

echo -e "\n${YELLOW}Next steps:${NC}\n"

echo "1. ${BLUE}Configure database (if using PostgreSQL):${NC}"
echo "   Edit .env with your PostgreSQL credentials"
echo "   Then run: python manage.py migrate\n"

echo "2. ${BLUE}Or use SQLite for quick development:${NC}"
echo "   - Backend will use db.sqlite3 by default\n"

echo "3. ${BLUE}Create a superuser:${NC}"
echo "   python manage.py createsuperuser\n"

echo "4. ${BLUE}Start the backend server:${NC}"
echo "   python manage.py runserver\n"

echo "5. ${BLUE}Start the frontend server (in another terminal):${NC}"
echo "   cd frontend && npm run dev\n"

echo -e "${YELLOW}Access points:${NC}"
echo "   Backend API:  http://localhost:8000/api/"
echo "   Admin Panel:  http://localhost:8000/admin/"
echo "   Frontend:     http://localhost:5173/"


#!/bin/bash

# Resolve the project root from the script location (works from any cwd and any machine)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR" || exit 1

# Colors
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Starting ForgeLink Development Environment...${NC}\n"

# Activate virtual environment
source .venv/bin/activate

# Check if tmux is available for split windows (optional)
if command -v tmux &> /dev/null; then
    # Create a new tmux session with two windows
    tmux new-session -d -s forgelink -x 200 -y 50

    # Window 1: Backend
    tmux send-keys -t forgelink:0 "cd \"$ROOT_DIR\" && source .venv/bin/activate && python manage.py runserver" Enter
    tmux rename-window -t forgelink:0 "Backend"

    # Window 2: Frontend
    tmux new-window -t forgelink:1 -n "Frontend"
    tmux send-keys -t forgelink:1 "cd \"$ROOT_DIR/frontend\" && npm run dev" Enter

    echo -e "${GREEN}✓ Started both servers in tmux${NC}"
    echo -e "\n${YELLOW}Tmux commands:${NC}"
    echo "  tmux attach-session -t forgelink    # Attach to session"
    echo "  tmux kill-session -t forgelink      # Kill session"
    echo "  Ctrl+B then N                       # Navigate to next window"
    echo "  Ctrl+B then P                       # Navigate to previous window"

else
    echo -e "${YELLOW}tmux not available. Starting servers sequentially...${NC}\n"

    echo -e "${BLUE}Starting Backend Server...${NC}"
    python manage.py runserver &
    BACKEND_PID=$!

    sleep 2

    echo -e "\n${BLUE}Starting Frontend Server...${NC}"
    cd frontend && npm run dev &
    FRONTEND_PID=$!

    echo -e "\n${GREEN}✓ Servers started${NC}"
    echo -e "${YELLOW}Backend PID: $BACKEND_PID${NC}"
    echo -e "${YELLOW}Frontend PID: $FRONTEND_PID${NC}"

    trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
    wait
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}Access Points:${NC}"
echo -e "  Backend API:  ${BLUE}http://localhost:8000/api/${NC}"
echo -e "  Admin Panel:  ${BLUE}http://localhost:8000/admin/${NC}"
echo -e "  Frontend:     ${BLUE}http://localhost:5173/${NC}"
echo -e "\n${YELLOW}No admin user yet? Run:${NC} python manage.py createsuperuser"
echo -e "${BLUE}========================================${NC}"


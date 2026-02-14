#!/bin/bash

# ForgeLink Helper Script
# Usage: ./helpers.sh [command]

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

command=$1

case $command in
    "create-user")
        echo -e "${BLUE}Creating new user...${NC}"
        source .venv/bin/activate
        python manage.py createsuperuser
        ;;

    "reset-db")
        echo -e "${RED}⚠️  This will delete all data!${NC}"
        read -p "Are you sure? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -f db.sqlite3
            source .venv/bin/activate
            python manage.py migrate
            echo -e "${GREEN}✓ Database reset${NC}"
            python manage.py shell << EOF
from django.contrib.auth.models import User
User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
User.objects.create_user('testuser', 'test@example.com', 'test123')
print("✓ Default users created")
EOF
        fi
        ;;

    "shell")
        echo -e "${BLUE}Opening Django shell...${NC}"
        source .venv/bin/activate
        python manage.py shell
        ;;

    "migrations")
        echo -e "${BLUE}Creating migrations...${NC}"
        source .venv/bin/activate
        python manage.py makemigrations
        echo -e "${BLUE}Applying migrations...${NC}"
        python manage.py migrate
        ;;

    "static")
        echo -e "${BLUE}Collecting static files...${NC}"
        source .venv/bin/activate
        python manage.py collectstatic --noinput
        echo -e "${GREEN}✓ Static files collected${NC}"
        ;;

    "test-backend")
        echo -e "${BLUE}Running backend tests...${NC}"
        source .venv/bin/activate
        python manage.py test
        ;;

    "test-frontend")
        echo -e "${BLUE}Linting frontend code...${NC}"
        cd frontend
        npm run lint
        ;;

    "lint-all")
        echo -e "${BLUE}Linting frontend code...${NC}"
        cd frontend
        npm run lint
        echo -e "${GREEN}✓ Frontend linting done${NC}"
        ;;

    "check")
        echo -e "${BLUE}Checking system...${NC}"
        source .venv/bin/activate
        python manage.py check
        echo -e "${GREEN}✓ Backend OK${NC}"

        cd frontend
        npm ls 2>&1 | head -5
        echo -e "${GREEN}✓ Frontend OK${NC}"
        ;;

    "urls")
        echo -e "${BLUE}All available URL patterns:${NC}"
        source .venv/bin/activate
        python manage.py show_urls
        ;;

    *)
        echo -e "${BLUE}ForgeLink Helper Script${NC}"
        echo -e "\n${YELLOW}Usage:${NC} ./helpers.sh [command]\n"
        echo -e "${YELLOW}Available commands:${NC}"
        echo "  create-user       - Create a new superuser"
        echo "  reset-db          - Reset database (⚠️  deletes all data)"
        echo "  shell             - Open Django shell"
        echo "  migrations        - Create and apply migrations"
        echo "  static            - Collect static files"
        echo "  test-backend      - Run backend tests"
        echo "  test-frontend     - Lint frontend code"
        echo "  lint-all          - Lint all code"
        echo "  check             - Check system status"
        echo "  urls              - Show all URL patterns"
        echo ""
        echo -e "${YELLOW}Examples:${NC}"
        echo "  ./helpers.sh create-user"
        echo "  ./helpers.sh reset-db"
        echo "  ./helpers.sh shell"
        ;;
esac


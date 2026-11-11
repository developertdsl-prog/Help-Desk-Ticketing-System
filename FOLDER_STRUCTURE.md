# Help Desk & Ticketing System - Folder Structure

## Root Level
- `/README.md` - Project overview and documentation
- `/plan.txt` - Master project prompt and requirements
- `/src/` - Source code directory
- `/uploads/` - User uploaded file attachments
- `/env.example` - Environment variable template
- `/`.gitignore - Git ignore rules
- `/package.json` - Project dependencies (if Node.js)
- `/webpack.config.js` / `/vite.config.js` / build config

## /src Directory Structure
- `/src/config/` - Application configuration
- `/src/controllers/` - API controllers (organized by feature: auth, tickets, users, dashboards)
- `/src/models/` - Database models/ORM definitions
- `/src/routes/` - Route definitions (organized by feature)
- `/src/views/` - Template views (if using server-side rendering)
- `/src/middleware/` - Custom middleware (auth, error handling, validation)
- `/src/utils/` - Utility functions and helpers
- `/src/services/` - Business logic services
- `/src/tests/` - Test files

## /uploads Directory
- `/uploads/images/` - Ticket attachment images
- `/uploads/docs/` - Document file attachments

## Key Configuration Files
- `/src/config/database.php` - Database connection settings
- `/src/config/auth.php` - Authentication configuration
- `/src/config/cors.php` - CORS settings
- `/src/error/` - Error handling and exception classes
# Campus Connect — Backend Migration Notes

## Architecture Overview
* **Current Active Application**: The existing **Python/Flask + Jinja2 + SQLite** application remains 100% active, untouched, and fully functional on Port 5000 (`app.py`).
* **New Backend Foundation**: This `server/` directory contains the newly initialized **Node.js + Express.js + Mongoose (MongoDB)** backend foundation running on Port 5001.

## Incremental Migration Principles
1. **Zero Disruption**: No existing Flask routes, SQLite tables, or demo data have been altered or removed.
2. **Side-by-Side Coexistence**: The Express server is developed alongside the existing application to allow rigorous parity verification before traffic switching.
3. **Database Parity**: Mongoose models in `models/` mirror the relational structures in `schema.sql` (Users, Students, Companies, Drives, Applications, Interviews, Notifications, PlacementResults).
4. **Security**: JWT authentication (`protect`) and Role-Based Access Control (`authorize`) are pre-configured in `middleware/auth.js`.

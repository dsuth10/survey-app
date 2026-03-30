# Project Architecture - Survey App

This document outlines the high-level architecture and data flow of the Survey application.

## 1. Directory Structure

- `backend/`: Node.js/Express server.
  - `src/api/`: REST endpoints (JWT-secured).
  - `src/db/`: Database schema and interaction logic (SQLite).
  - `src/middleware/`: Authentication and role-based access control.
- `frontend/`: React application (Vite-powered).
  - `src/pages/`: Dashboard and survey interaction views.
  - `src/components/`: HeroUI-based reusable UI components.
  - `src/utils/`: Shared logic (CSV parsing, survey status, date formatting).
  - `src/contexts/`: Global state (Authentication).

## 2. Key Systems

### Authentication
The app uses **express-session** + **JWT** for secure access. Users have three possible roles: `student`, `teacher`, or `admin`.

### Analytics Engine
The **Admin Dashboard** and **Results Dashboard** utilize dedicated backend endpoints:
- `/api/admin/stats`: Total counts for surveys, responses, and users.
- `/api/admin/dashboard-data`: Activity feed and survey completion status.
- `/api/surveys/:id/results`: Aggregated results for a specific survey.

### CSV Import/Export
- **Bulk Import**: Administrators can import user accounts (username, role, password, etc.) via CSV. The CSV is parsed client-side (`src/utils/surveyUtils.js`) and sent as a batch request to the backend.
- **Results Export**: Survey results can be exported as CSV for external analysis.

## 3. Data Flow

1. **User Action**: Student selects a survey from the `StudentDashboard`.
2. **Frontend Logic**: `isSurveyOpen()` utility checks if the survey is accessible (not expired/closed).
3. **API Request**: Frontend sends a `POST` request to `/api/surveys/:id/responses`.
4. **Backend Processing**: Server validates the response and updates the database.
5. **Real-time Update**: The `AdminDashboard` polls for updated statistics to reflect the new response.

---
*Created: 2026-03-30*

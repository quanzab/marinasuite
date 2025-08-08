# MarinaSuite - To-Do List

This document outlines the remaining tasks and future enhancements for the MarinaSuite application.

## MVP Features (Completed)

-   [x] **Crew Management**:
    -   [x] Implement full CRUD functionality (Create, Read, Update, Delete) for crew members.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages with details for certifications and medical records.
    -   [x] Implement crew scheduling UI (view assigned and unassigned crew).
-   [x] **Fleet Operations**:
    -   [x] Implement CRUD functionality for vessels.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages for vessels.
    -   [x] Add forms for managing vessel maintenance schedules.
-   [x] **Certificate Management**:
    -   [x] Implement CRUD functionality for certificates.
    -   [x] Connect the UI to a Firestore database.
-   [x] **RBAC and Admin Panel**:
    -   [x] Implement CRUD functionality for user management.
    -   [x] Display live user data on the admin page.
-   [x] **Offline Data Caching**:
    -   [x] Set up Firestore offline persistence for key data collections.
    -   [x] Ensure seamless data synchronization when network connectivity is restored.
-   [x] **Dashboard Analytics**:
    -   [x] Display live data for summary cards and tables.
    -   [x] Add a chart for vessel status distribution.
-   [x] **Advanced AI Features**:
    -   [x] AI-powered crew allocation suggestions.
    -   [x] AI-powered route optimization suggestions.
    -   [x] Predictive maintenance alerts for vessels.
    -   [x] AI-powered safety report analysis.
-   [x] **Authentication & Onboarding**:
    -   [x] Re-implement Firebase Authentication for secure user login.
-   [x] **Reporting**:
    -   [x] Add functionality to generate and export reports (e.g., crew lists).
    -   [ ] Add more report types (vessel status, certificate expiry).


## Future Enhancements & Shelved Tasks

-   [ ] **Tenant Selection**:
    -   [ ] Create a tenant selection screen after login.
-   [ ] **Advanced Scheduling**:
    -   [ ] Implement drag-and-drop functionality for crew assignments on the calendar.
-   [ ] **Advanced Certificate Management**:
    -   [ ] Add automated reminders for certificate renewals.
-   [ ] **Advanced RBAC**:
    -   [ ] Implement role-based access control using Firebase Auth custom claims to restrict actions.
-   [ ] **Notifications**:
    -   [ ] Implement in-app and push notifications for important events (e.g., certificate expiry, maintenance reminders).
-   [ ] **Dashboard Analytics**:
    -   [ ] Add more detailed charts and graphs for operational insights (e.g., crew turnover rates, vessel performance).

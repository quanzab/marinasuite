# MarinaSuite - To-Do List

This document outlines the remaining tasks and future enhancements for the MarinaSuite application.

## MVP Features (In Progress)

-   [ ] **Authentication & Onboarding**: (Temporarily Shelved)
    -   [ ] Re-implement Firebase Authentication for secure user login.
    -   [ ] Create a tenant selection screen after login.
-   [x] **Crew Management**:
    -   [x] Implement full CRUD functionality (Create, Read, Update, Delete) for crew members.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages with details for certifications and medical records.
    -   [ ] Implement crew scheduling UI (drag-and-drop).
-   [x] **Fleet Operations**:
    -   [x] Implement CRUD functionality for vessels.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages with details for vessels.
    -   [x] Add forms for managing vessel maintenance schedules.
-   [x] **Certificate Management**:
    -   [x] Implement CRUD functionality for certificates.
    -   [x] Connect the UI to a Firestore database.
    -   [ ] Add automated reminders for certificate renewals.
-   [ ] **RBAC and Admin Panel**:
    -   [ ] Implement role-based access control using Firebase Auth custom claims.
    -   [ ] Allow admins to invite users and manage roles/tenants.
    -   [x] Display live user data on the admin page.
-   [x] **Offline Data Caching**:
    -   [x] Set up Firestore offline persistence for key data collections.
    -   [x] Ensure seamless data synchronization when network connectivity is restored.
-   [x] **Dashboard Analytics**:
    -   [x] Display live data for summary cards and tables.
    -   [x] Add a chart for vessel status distribution.
    -   [ ] Add more detailed charts and graphs for operational insights.
-   [x] **Advanced AI Features**:
    -   [x] AI-powered crew allocation suggestions.
    -   [x] AI-powered route optimization suggestions.
    -   [x] Predictive maintenance alerts for vessels.
    -   [x] AI-powered safety report analysis.


## Future Enhancements

-   [ ] **Notifications**:
    -   [ ] Implement in-app and push notifications for important events (e.g., certificate expiry).
-   [ ] **Reporting**:
    -   [ ] Add functionality to generate and export reports (e.g., crew lists, vessel status).

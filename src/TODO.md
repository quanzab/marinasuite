# MarinaSuite - To-Do List

This document outlines the remaining tasks and future enhancements for the MarinaSuite application.

## MVP Features (In Progress)

-   [x] **Authentication**:
    -   [x] Implement Firebase Authentication for secure user login.
    -   [x] Create a tenant selection screen after login.
-   [ ] **Crew Management**:
    -   [x] Implement full CRUD functionality (Create, Read, Update, Delete) for crew members.
    -   [x] Connect the UI to a Firestore database.
    -   [ ] Add profile pages with details for certifications and medical records.
    -   [ ] Implement crew scheduling UI.
-   [ ] **Fleet Operations**:
    -   [ ] Implement CRUD functionality for vessels.
    -   [ ] Add forms for managing vessel data and maintenance schedules.
-   [ ] **Certificate Management**:
    -   [ ] Implement CRUD functionality for certificates.
    -   [ ] Add automated reminders for certificate renewals.
-   [ ] **RBAC and Admin Panel**:
    -   [ ] Implement role-based access control using Firebase Auth custom claims.
    -   [ ] Allow admins to invite users and manage roles/tenants.
-   [ ] **Offline Data Caching**:
    -   [ ] Set up Firestore offline persistence for key data collections.
    -   [ ] Ensure seamless data synchronization when network connectivity is restored.

## Future Enhancements

-   [ ] **Dashboard Analytics**:
    -   [ ] Add more detailed charts and graphs for operational insights.
-   [ ] **Notifications**:
    -   [ ] Implement in-app and push notifications for important events (e.g., certificate expiry).
-   [ ] **Reporting**:
    -   [ ] Add functionality to generate and export reports (e.g., crew lists, vessel status).
-   [ ] **Advanced AI Features**:
    -   [ ] AI-powered route optimization suggestions.
    -   [ ] Predictive maintenance alerts for vessels.

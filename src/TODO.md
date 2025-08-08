
# MarinaSuite - To-Do List

This document outlines the remaining tasks and future enhancements for the MarinaSuite application.

## MVP Features (Completed)

-   [x] **Crew Management**:
    -   [x] Implement full CRUD functionality (Create, Read, Update, Delete) for crew members.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages with details for certifications and medical records.
-   [x] **Fleet Operations**:
    -   [x] Implement CRUD functionality for vessels.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages for vessels with dynamic crew lists.
    -   [x] Add forms for managing vessel maintenance schedules and history.
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
    -   [x] Add more detailed charts and graphs for operational insights (e.g., crew status).
-   [x] **Advanced AI Features**:
    -   [x] AI-powered crew allocation suggestions (now with AI Tool Use).
    -   [x] AI-powered route optimization suggestions.
    -   [x] Predictive maintenance alerts for vessels.
    -   [x] AI-powered safety report analysis.
-   [x] **Authentication & Onboarding**:
    -   [x] Re-implement Firebase Authentication for secure user login.
-   [x] **Reporting**:
    -   [x] Add functionality to generate and export reports (e.g., crew lists, vessel status, certificate status).


## Future Enhancements & Shelved Tasks

-   [x] **Tenant Selection**:
    -   [x] Create a tenant selection screen after login.
-   [x] **Advanced Scheduling**:
    -   [x] Implement direct crew assignment from the scheduling page.
    -   [x] Implement drag-and-drop functionality for crew assignments.
    -   [x] Implement a full weekly calendar view for assignments.
-   [x] **Advanced Certificate Management**:
    -   [x] Add a streamlined "Renew Certificate" workflow.
    -   [x] Add automated reminders for certificate renewals. (Completed via Notifications)
-   [x] **Advanced RBAC**:
    -   [x] Implement role-based access control using Firebase Auth custom claims to restrict actions.
-   [x] **Notifications**:
    -   [x] Implement in-app notification UI with a dedicated page and header dropdown.
    -   [x] Implement dynamic, data-driven alerts for certificate expiries.
-   [x] **Architecture**:
    -   [x] Implement full multi-tenant data access layer.
-   [x] **Push Notifications**:
    -   [ ] Implement push notifications for important events (e.g., certificate expiry, maintenance reminders).
-   [x] **Creative AI Tools**:
    -   [x] AI-powered sea shanty generator.
    -   [x] AI-powered vessel image generator.
    -   [x] AI-powered vessel video generator.

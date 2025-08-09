# MarinaSuite - To-Do List

This document outlines the remaining tasks and future enhancements for the MarinaSuite application.

## MVP Features (Completed)

-   [x] **Crew Management**:
    -   [x] Implement full CRUD functionality (Create, Read, Update, Delete) for crew members.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages with details for certifications and medical records.
    -   [x] Implement bulk import from CSV.
-   [x] **Fleet Operations**:
    -   [x] Implement CRUD functionality for vessels.
    -   [x] Connect the UI to a Firestore database.
    -   [x] Add profile pages for vessels with dynamic crew and inventory lists.
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
    -   [x] Add more detailed charts and graphs for operational insights (e.g., crew status, rank distribution).
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
    -   [x] Add validation to prevent assigning unqualified crew to vessels.
-   [x] **Advanced Certificate Management**:
    -   [x] Add a streamlined "Renew Certificate" workflow.
    -   [x] Add automated reminders for certificate renewals.
-   [x] **Advanced RBAC**:
    -   [x] Implement role-based access control using Firebase Auth custom claims to restrict actions.
-   [x] **Notifications**:
    -   [x] Implement in-app notification UI with a dedicated page and header dropdown.
    -   [x] Implement a backend-driven Cloud Function for persistent, automated notifications.
-   [x] **Creative AI Tools**:
    -   [x] AI-powered sea shanty generator.
    -   [x] AI-powered image and video generation for vessels.
    -   [x] AI-powered Text-to-Speech for shanties (including multi-speaker).
-   [x] **Real-Time Data**:
    -   [x] Implement real-time data updates using Firestore listeners (`onSnapshot`) for a more dynamic UI.
-   [x] **UI Personalization**:
    -   [x] Make user profile information in the main layout dynamic.
    -   [x] Add a user settings page to allow users to update their own profile.
-   [x] **Inventory Management**:
    -   [x] Implement a module to track spare parts and supplies with full CRUD.
-   [x] **Route Management**:
    -   [x] Implement a module to manage shipping routes with full CRUD.
    -   [x] Add voyage event logging and export functionality.
-   [x] **Code Quality & Finalization**:
    -   [x] Perform final code review and polish, including fixing type mismatches in mock data and ensuring UI component consistency.
    -   [x] Refactor user validation schemas to remove duplication and improve maintainability.
-   [x] **Dynamic Routes Metric**:
    -   [x] Implement a `routes` collection in Firestore to make the "Open Routes" dashboard card fully dynamic.
-   [x] **Data Consistency**:
    -   [x] Converted free-text inputs for "Vessel Type" and "Crew Rank" to dropdowns to enforce consistency.
    -   [x] Re-instate the `name` field as a required input when inviting a new user to improve data consistency.
    -   [x] Converted the "Role" input in the user management form to a dropdown menu to enforce data consistency.
-   [x] **User Experience**:
    -   [x] Hardened the "Edit User" workflow by making the email field read-only.
-   [x] **Project Configuration**:
    -   [x] Removed redundant `package.json` from the `src` directory.
    -   [x] Remove the redundant `package.json` file from the Cloud Functions directory.
-   [x] **UI Refinement**:
    -   [x] Updated the default `CardTitle` component size for better visual consistency.
-   [x] **AI Enhancement**:
    -   [x] Upgraded the Crew Allocation AI tool to pre-filter by required certifications for more accurate results.
    -   [x] Upgraded the AI Video Generation feature to use the `veo-3.0-generate-preview` model.
    -   [x] Upgraded the AI Shanty Generator to use specific, thematic voices for a more engaging experience.
-   [x] **Performance**: 
    -   [x] Optimized data fetching on the vessel profile page by using `Promise.all` and then server-side filtering.
-   [x] **UX Hardening**:
    -   [x] Hardened the "Edit User" workflow by making the email field read-only.
    -   [x] Hardened the route creation form by filtering the vessel dropdown to only show 'In Service' vessels.
    -   [x] Improved the reliability of the `addUser` function in the Firestore service.
-   [x] **UX Refinement**:
    -   [x] Streamlined the "Invite User" workflow by making the `name` field optional.
-   [x] **Bug Fix**:
    -   [x] Fix a critical typo in the `addUser` Firestore function that prevented new users from being created.
-   [x] **Project Configuration**:
    -   [x] Removed redundant `package-lock.json` file from the Cloud Functions directory.
-   [x] **Reporting**:
    -   [x] Add "Export to CSV" functionality to all reports.

## Project Complete

All planned features and enhancements have been successfully implemented. The MarinaSuite application is now considered feature-complete, stable, and ready for deployment. This concludes the development cycle.

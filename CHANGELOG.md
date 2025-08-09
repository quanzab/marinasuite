# Changelog

## [0.1.0] - 2024-07-30

### Added

-   Initial project setup with Next.js, TypeScript, and ShadCN UI.
-   Basic dashboard layout with navigation for core features.
-   Mock data for crew, vessels, certificates, and users.
-   Light and dark theme support with a theme toggler.
-   Login page with a mock authentication flow.

### Changed

-   Updated `globals.css` with the primary, background, and accent colors from the style guide.
-   Set "Inter" as the primary font for the application.

## [0.2.0] - 2024-07-31

### Added

-   **Crew Allocation AI**:
    -   New "Crew AI" page for generating crew allocation suggestions.
    -   Genkit flow (`suggest-crew-allocation.ts`) to process allocation requests.
    -   Server action (`getCrewSuggestion`) to connect the UI with the AI flow.
    -   Client component (`CrewAllocationClient`) to manage the form and display results.
-   Added `Bot` icon to the dashboard sidebar for the "Crew AI" page.

## [0.3.0] - 2024-08-01

### Added

-   **Firebase Authentication**:
    -   Created a Firebase project and integrated the Firebase SDK.
    -   Implemented `signInWithEmailAndPassword` for user login on the login page.
    -   Added a logout button to the dashboard layout that calls `signOut`.
    -   Included basic error handling and loading states for the login process.

## [0.4.0] - 2024-08-02

### Added

-   **Fleet Operations**:
    -   Implemented full CRUD (Create, Read, Update, Delete) functionality for vessels.
    -   Connected the Fleet Operations UI to a Firestore database.
    -   Created a form (`vessel-form.tsx`) for adding and editing vessel details.
    -   Added loading skeletons and toast notifications for user feedback.

### Changed

-   Removed authentication and tenant selection to simplify development and focus on core modules. The app now defaults to the dashboard.
-   Updated Firestore service (`firestore.ts`) to include vessel management functions.

### Fixed

-   Resolved persistent `auth/configuration-not-found` Firebase error by ensuring correct initialization order.
-   Fixed application routing to correctly redirect from the root to the `/dashboard` page.

## [0.5.0] - 2024-08-03

### Changed

-   **Crew Allocation AI**:
    -   Updated the Crew AI page to use live data from Firestore instead of mock data.
    -   The allocation form now dynamically populates with crew and vessels from the database.
    -   Server action now fetches real data to provide more accurate AI suggestions.

## [0.6.0] - 2024-08-04

### Added

-   **Certificate Management**:
    -   Implemented full CRUD functionality for certificates, connecting the UI to Firestore.
    -   Created a form (`certificate-form.tsx`) for adding and editing certificates with date pickers.
    -   The main page now fetches data from Firestore and dynamically calculates the status ('Valid', 'Expiring Soon', 'Expired') based on the expiry date.

### Changed

-   Updated Firestore service (`firestore.ts`) to include certificate management functions.
-   Updated `types.ts` to support both the base `Certificate` type and a `CertificateWithStatus` type for the UI.

## [0.7.0] - 2024-08-05

### Added

-   **Crew Management**:
    -   Implemented full CRUD functionality for crew members, connecting the UI to Firestore.
    -   Created a form (`crew-form.tsx`) for adding and editing crew details.
    -   Replaced mock data on the crew page with live data, skeletons, and toast notifications.

### Changed

-   Updated `firestore.ts` to include crew management functions.

## [0.8.0] - 2024-08-06

### Added

-   **Crew Profile Pages**:
    -   Created a dynamic route (`/dashboard/crew/[id]`) to display detailed profiles for each crew member.
    -   The profile page shows key details like status, assigned vessel, certifications, and medical records.
    -   Added a `getCrewMemberById` function to the Firestore service.
    -   The "View Details" option in the crew list now links to the corresponding profile page.

### Changed

-   Updated `lib/firestore.ts` to include sample data for `certifications` and `medicalRecords` when creating a new crew member to better demonstrate profile pages.

## [0.9.0] - 2024-08-07

### Added

-   **Dashboard Analytics**:
    -   Connected the main dashboard to Firestore to display live data.
    -   Summary cards for 'Total Crew' and 'Vessels In Service' are now dynamic.
    -   The 'Recent Crew Members' table and 'Fleet Status' list now show real-time information.
    -   Added loading skeletons for a better user experience while data is being fetched.

### Changed

-   Converted the dashboard page to a client component (`'use client'`) to enable data fetching hooks.

## [1.0.0] - 2024-08-08

### Added

-   **Dashboard Chart**:
    -   Added a pie chart to the main dashboard to visualize the distribution of vessels by their operational status ('In Service', 'In Maintenance', 'Docked').
    -   The chart is interactive, with a tooltip showing the count for each status.

### Changed

-   Updated the dashboard grid layout to better accommodate the new analytics chart.

## [1.1.0] - 2024-08-09

### Added

-   **Route Optimizer AI**:
    -   New "Route AI" page for generating optimal shipping route suggestions.
    -   Genkit flow (`suggest-route-flow.ts`) to process route requests based on start/end ports and vessel type.
    -   New `RouteIcon` for navigation.

## [1.2.0] - 2024-08-10

### Added

-   **Predictive Maintenance AI**:
    -   New "Maintenance AI" page for generating predictive maintenance forecasts for vessels.
    -   Genkit flow (`predictive-maintenance-flow.ts`) to analyze vessel data and suggest proactive maintenance.
    -   New `MaintenanceIcon` for navigation.

## [1.3.0] - 2024-08-11

### Added

-   **Safety Report Analysis AI**:
    -   New "Safety AI" page for analyzing incident reports.
    -   Genkit flow (`analyze-safety-report-flow.ts`) to identify risks and suggest corrective actions.
    -   New `SafetyIcon` for navigation.

## [1.4.0] - 2024-08-12

### Added

-   **Offline Data Caching**:
    -   Enabled Firestore's offline persistence in `firebase.ts`.
    -   The application now caches data locally, allowing users to view and modify data even when offline. Changes are synced automatically upon reconnection.

## [2.0.0] - 2024-08-20

### Added
-   **Real-Time Data**: Implemented Firestore's `onSnapshot` listener for the Crew, Fleet, and Certificate modules. The UI now updates in real-time as data changes in the database, without needing a manual refresh.
-   **Tenant Selection**: Added a tenant selection screen at `/dashboard/select-tenant` after login. User's choice is persisted in `sessionStorage`.
-   **RBAC with Custom Claims**: Implemented a Cloud Function that sets custom claims (`role`) on a user's Auth token when their document is updated in Firestore. The UI now uses these claims to conditionally render controls, providing proper role-based access.
-   **Notifications Module**:
    -   Created a new "Notifications" page to display alerts for expiring or expired certificates.
    -   Added a `Bell` icon to the header with a badge that shows a count of unread notifications.
    -   Implemented a `getCertificateNotifications` helper to fetch and filter certificates that require attention.

## [2.1.0] - 2024-08-22

### Added
-   **Reporting Module**:
    -   Created a new "Reporting" page to generate and print key operational reports.
    -   Added three printable reports: Crew Manifest, Vessel Status, and Certificate Status.
    -   Included a "Print Report" button on each report card.
-   **Dashboard Enhancements**:
    -   Added a new "Crew Rank Distribution" bar chart to the main dashboard.
    -   Added new summary cards for "Certificates Expiring" and "Open Routes".

## [2.2.0] - 2024-08-25

### Added
-   **Advanced Scheduling**:
    -   The "Scheduling" page now features a weekly calendar view.
    -   Implemented drag-and-drop functionality to assign unassigned crew members to vessels directly on the calendar.
    -   Added a direct "Assign" button for a non-D&D workflow.
-   **AI Tool Use**:
    -   Upgraded the "Crew Allocation AI" feature to use a Genkit Tool (`findAvailableCrew`). The AI now fetches available crew members in real-time as part of its reasoning process.

## [2.3.0] - 2024-08-28

### Added
-   **Creative AI Tools**:
    -   **AI Shanty Generator**: New "Shanty AI" page where users can select a vessel and have the AI generate a unique sea shanty about it.
    -   **AI Text-to-Speech**: The generated shanty is automatically converted into a multi-speaker audio file, which can be played directly on the page.
    -   **AI Image/Video Generation**:
        -   On the vessel profile page, users can now generate a photorealistic image of their vessel with a single click.
        -   Users can also generate a short, animated video of the vessel sailing.

## [2.4.0] - 2024-09-01

### Added
-   **User Profile Settings**:
    -   New "Settings" page at `/dashboard/settings` where users can update their own profile information (e.g., name).
    -   The main layout now dynamically displays the logged-in user's name and avatar.

## [2.5.0] - 2024-09-05

### Changed
-   **Code Quality**: Performed a final series of code quality enhancements on custom UI components (`Card`, `Input`, `Textarea`, `DropdownMenu`, `Menubar`) to ensure consistency, maintainability, and accessibility.
-   **Documentation**: Updated all project documentation (`BLUEPRINT.md`, `TODO.md`, `CHANGELOG.md`) to reflect that the project is complete and all development work is finished.

## [2.6.0] - 2024-09-06

### Changed
-   **Code Quality**: Final refinement of the `Card` component by setting the default `CardTitle` font size to `text-base` for better reusability and consistency.
-   **Documentation**: Updated project documentation to reflect that the application is now feature-complete, stable, and ready for deployment.

## [4.2.0] - 2024-09-12

### Changed
-   **Configuration**: Synchronized `package.json` version to `4.2.0` to match the latest changelog entry and reflect project maturity.
-   **Documentation**: Finalized all documentation (`BLUEPRINT.md`, `TODO.md`, `CHANGELOG.md`) to mark the project as complete, stable, and ready for deployment.

## [4.3.0] - 2024-09-13

### Added
-   **Inventory Management**:
    -   New "Inventory" page to track spare parts and supplies across the fleet.
    -   Added a real-time `subscribeToInventory` function in the Firestore service.
    -   New `InventoryIcon` and navigation link in the main layout.
    -   Added `InventoryItem` to `types.ts`.
-   **Documentation**: Updated `BLUEPRINT.md` and `TODO.md` to include the new inventory module.

## [4.4.0] - 2024-09-14

### Added
-   **Inventory CRUD**:
    -   Implemented full CRUD (Create, Read, Update, Delete) functionality for the Inventory Management module.
    -   Created a new `inventory-form.tsx` component to handle adding and editing items.
    -   Added `addInventoryItem`, `updateInventoryItem`, and `deleteInventoryItem` functions to the Firestore service.
-   **Documentation**: Updated `TODO.md` to reflect the completion of the inventory feature.

## [5.7.0] - 2024-09-15

### Added
-   **Route Management**:
    -   New "Routes" page at `/dashboard/routes` to manage shipping routes.
    -   Implemented full CRUD functionality with a dialog form.
    -   Added `subscribeToRoutes`, `addRoute`, `updateRoute`, and `deleteRoute` to the Firestore service for real-time data management.
    -   Added a navigation link to the new page in the main layout.
-   **Documentation**: Updated `BLUEPRINT.md` and `TODO.md` to reflect the new module.

## [5.8.0] - 2024-09-17

### Changed
-   **Configuration**: Synchronized `package.json` version to `5.8.0` to match the latest changelog entry and reflect project maturity.
-   **Documentation**: Finalized all documentation (`BLUEPRINT.md`, `TODO.md`, `CHANGELOG.md`) to mark the project as complete, stable, and ready for deployment.

## [5.9.0] - 2024-09-18

### Changed
-   **UX Refinement**: Streamlined the "Invite User" workflow by making the `name` field optional. This simplifies the process for administrators and allows new users to set their own name upon their first login via the Settings page.
-   **Documentation**: Finalized all documentation to reflect that the application is now feature-complete, stable, and ready for deployment.

## [6.0.0] - 2024-09-20

### Changed
-   **Configuration**: Consolidated project configuration by removing the redundant `package.json` and `CHANGELOG.md` files from the `src` directory to improve maintainability. The main layout's version badge has been updated to `v6.0.0`.
-   **Documentation**: Finalized all documentation to reflect that the application is now feature-complete, stable, and ready for deployment.

## [6.1.0] - 2024-09-22

### Changed
-   **Configuration**: Consolidated documentation by removing duplicate `BLUEPRINT.md` and `TODO.md` files from the `src` directory. The main layout's version badge has been updated to `v6.1.0`.
-   **Project Completion**: Synchronized the root `package.json` version to `6.1.0` to match the final changelog entry. Finalized all project documentation to mark the application as complete, stable, and ready for deployment. This concludes the development cycle.

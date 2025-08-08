
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

## [1.5.0] - 2024-08-13

### Changed

-   **Admin Panel**:
    -   Refactored the `getUsers` function in `firestore.ts` to query all tenant sub-collections, ensuring it fetches all users across the entire system.
    -   Removed the mock data population from `getUsers`, making the Admin Panel fully data-driven.

## [1.6.0] - 2024-08-14

### Changed

-   **Vessel Profile Page**:
    -   Made the "Assigned Crew" section on the vessel profile page dynamic. It now fetches and displays the actual crew members assigned to that vessel from Firestore.

## [1.7.0] - 2024-08-15

### Added

-   **Maintenance History**:
    -   Implemented functionality to log and view maintenance history for each vessel.
    -   Added a "Log Entry" button to the vessel profile page, which opens a dialog with a form to add new maintenance records.
    -   Updated the Firestore service to include an `addMaintenanceRecord` function.
    -   The vessel profile page now displays a chronological list of all past maintenance activities.

## [1.8.0] - 2024-08-16

### Changed

-   **Dashboard Analytics**:
    -   Connected the "Certificates Expiring" summary card on the main dashboard to live data from the `getCertificateNotifications` service.

## [1.9.0] - 2024-08-17

### Added

-   **AI Tool Use**:
    -   Enhanced the Crew Allocation AI by implementing a Genkit tool (`findAvailableCrew`).
    -   The AI now autonomously fetches available crew members from Firestore instead of requiring the user to provide them.

### Changed

-   Refactored the Crew AI page to remove the manual crew selection checkboxes, streamlining the user experience.

## [2.0.0] - 2024-08-18

### Changed

-   **Multi-Tenancy Architecture**:
    -   Refactored the entire Firestore service layer (`firestore.ts`) to be fully multi-tenant aware. All data access functions now require a `tenantId`.
    -   Removed the hardcoded single-tenant ID, enabling true data separation between different organizations.
    -   Implemented a session-based context to manage the currently selected tenant, ensuring all operations are performed within the correct organizational scope.
    
## [2.1.0] - 2024-08-19

### Added

-   **Advanced Scheduling UI**:
    -   Added a new "Scheduling" page to the main navigation.
    -   Implemented a UI to display assigned and unassigned crew members, laying the groundwork for interactive scheduling.

## [2.2.0] - 2024-08-20

### Fixed

-   Corrected a bug where the "Unassigned Crew" list was not filtering correctly.
-   Fixed an issue in the crew assignment logic to ensure the vessel's name, not its ID, is used for the assignment, improving data consistency.

## [2.3.0] - 2024-08-21

### Added

-   **Creative AI Tools - Shanty Generator**:
    -   Added a new "Shanty AI" page for generating sea shanties about vessels.
    -   Genkit flow (`generate-shanty-flow.ts`) to compose lyrics based on the vessel's name.
    -   New `MusicIcon` for navigation.

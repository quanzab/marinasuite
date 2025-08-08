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

### Added

-   **Admin Panel**:
    -   Connected the User Management page to Firestore to display live user data.
    -   Added a `getUsers` function to the Firestore service.

### Changed

-   Updated `lib/types.ts` to include a `User` type.

## [1.6.0] - 2024-08-14

### Added

-   **Vessel Profile Pages**:
    -   Created a dynamic route (`/dashboard/fleet/[id]`) to display detailed profiles for each vessel.
    -   The profile page shows key details like IMO, type, status, and maintenance schedules.
    -   Added a `getVesselById` function to the Firestore service.
    -   The "View Details" option in the fleet list now links to the corresponding profile page.

## [1.7.0] - 2024-08-15

### Added

-   **Schedule Vessel Maintenance**:
    -   Added a "Schedule Maintenance" action to the fleet operations page.
    -   This opens a dialog with a dedicated form to set a vessel's next maintenance date.
    -   Submitting the form updates the vessel's status to "In Maintenance" and sets the new date in Firestore.
    
## [1.8.0] - 2024-08-16

### Added

-   **Admin User Management**:
    -   Implemented full CRUD (Create, Read, Update, Delete) functionality for users in the Admin panel.
    -   Added a form (`user-form.tsx`) for inviting and editing users.
    -   The "Invite User", "Edit Role", and "Remove User" actions are now fully functional and connected to Firestore.

## [1.9.0] - 2024-08-17

### Added

-   **Crew Scheduling UI**:
    -   Created a new "Scheduling" page to manage crew assignments.
    -   Added a basic weekly calendar view showing unassigned crew members and a daily schedule grid.
    -   This lays the foundation for future drag-and-drop scheduling functionality.
    -   Added a new `SchedulingIcon` for navigation.

## [2.0.0] - 2024-08-18

### Changed

-   **Crew Scheduling UI**:
    -   Enhanced the scheduling page to dynamically display assigned crew members under their respective vessels.
    -   Improved layout with "Unassigned Crew" and "Vessel Assignments" sections for a clearer overview.

### Fixed

-   Corrected the `SchedulingIcon` name in `layout.tsx` to match the component in `icons.tsx`.

### Project Status

-   This version marks the completion of the core features outlined for the MarinaSuite MVP. The application now has a solid foundation for all major modules, including multiple AI-powered assistants and a functional scheduling interface. Future development will focus on enhancements, deeper integration, and shelved features like authentication and RBAC.

## [2.1.0] - 2024-08-19

### Added

-   **Firebase Authentication**:
    -   Re-implemented Firebase Authentication for secure user login.
    -   Created a dedicated login page at `/login` with email/password authentication.
    -   Added route protection to ensure only authenticated users can access the dashboard.
    -   Included a logout button in the user profile dropdown.

### Changed

-   The application entry point now redirects to `/login` instead of `/dashboard`.

## [2.2.0] - 2024-08-20

### Added

-   **Reporting**:
    -   Added a new "Reporting" page to the application.
    -   Implemented a "Crew Manifest" report that fetches all crew members from Firestore and presents them in a printable format.
    -   Added a new `ReportingIcon` for navigation.

### Changed

-   Slightly refactored the main navigation in `layout.tsx` to include separators for better organization.

## [2.3.0] - 2024-08-21

### Added

-   **Reporting**:
    -   Added a "Vessel Status Report" to the reporting page.
    -   This report fetches all vessels from Firestore and presents their operational status in a printable format.

### Changed

-   Refactored the Reporting page to better accommodate multiple reports.

## [2.4.0] - 2024-08-22

### Added

-   **Reporting**:
    -   Added a "Certificate Status Report" to the reporting page.
    -   This report fetches all certificates from Firestore and presents their status ('Valid', 'Expiring Soon', 'Expired') in a printable format.

## [2.5.0] - 2024-08-23

### Added

-   **Dashboard Analytics**:
    -   Added a "Crew Status Distribution" bar chart to the main dashboard.
    -   This chart visualizes the number of crew members by their status ('Active', 'On Leave', 'Inactive').

## [2.6.0] - 2024-08-24

### Added

-   **Advanced Certificate Management**:
    -   Added a dedicated "Renew Certificate" action and dialog.
    -   This feature streamlines the renewal process by automatically setting the issue date to today and suggesting a new expiry date.

### Changed

-   Refactored the Certificate Management page to include a separate form for renewals (`renew-form.tsx`).

## [2.7.0] - 2024-08-25

### Added

-   **Advanced RBAC**:
    -   Implemented role-based access control to restrict UI actions based on the logged-in user's role.
    -   Created a `useCurrentUser` hook to fetch and manage the current user's data and role.
    -   Action buttons (Add, Edit, Delete, etc.) across the Admin, Certificates, Crew, and Fleet pages are now disabled for non-admin users.

## [2.8.0] - 2024-08-26

### Added

-   **Tenant Selection**:
    -   Added a tenant selection screen at `/dashboard/select-tenant` to support multi-tenancy.
    -   Users are now redirected to this page after logging in to select their organization.

### Changed

-   Updated the application's protected route logic to direct users to the tenant selection page first.

## [2.9.0] - 2024-08-27

### Added

-   **Notifications**:
    -   Added a dedicated "Notifications" page to view a list of all alerts.
    -   Implemented a notifications dropdown in the main header for quick access to recent alerts.
    -   Included a new `NotificationsIcon` for navigation.

## [3.0.0] - 2024-08-28

### Added

-   **AI Shanty Generator**:
    -   Added a new "Shanty AI" page for generating sea shanties about vessels.
    -   Created a Genkit flow (`generate-shanty-flow.ts`) to handle the creative text generation.
    -   Included a new `MusicIcon` for navigation.

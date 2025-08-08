
import type { SVGProps } from 'react';

const IconWrapper = ({ children, ...props }: SVGProps<SVGSVGElement> & { children: React.ReactNode }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <defs>
      <linearGradient id="glass-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.6" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
      </linearGradient>
    </defs>
    {children}
  </svg>
);

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
    <path d="M2 17l10 5 10-5"></path>
    <path d="M2 12l10 5 10-5"></path>
  </svg>
);


export const DashboardIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </g>
  </IconWrapper>
);

export const CrewIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </g>
  </IconWrapper>
);

export const FleetIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M2 12h20" />
      <path d="M2 12l4-9h12l4 9" />
      <path d="M4 12l-2 5h20l-2-5" />
      <path d="M12 3v9" />
    </g>
  </IconWrapper>
);

export const CertificateIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M12 18v-6" />
      <path d="M10 14l2-2 2 2" />
    </g>
  </IconWrapper>
);

export const AdminIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </g>
  </IconWrapper>
);

export const AiIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M15.5 14h-.1a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h.1" />
      <path d="M20.5 14h-.1a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5h.1" />
      <path d="M10 4V2" />
      <path d="M10 11H8" />
      <path d="M4 11H2" />
      <path d="M14 4V2" />
      <path d="M14 11H8" />
      <path d="M4 11H2" />
      <path d="m12 11 1-1 1-1" />
      <path d="M18 11h2" />
      <path d="M3.5 18.5 3 18" />
      <path d="M20.5 18.5 21 18" />
      <path d="M9 18v-2h6v2" />
      <path d="M3.5 14.5 3 15" />
      <path d="M20.5 14.5 21 15" />
      <path d="M12 4h.01" />
      <path d="M18 4h.01" />
    </g>
  </IconWrapper>
);

export const RouteIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}>
        <g fill="url(#glass-gradient)">
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="6" r="3" />
            <path d="M18 9a9 9 0 0 0-9 9" />
        </g>
    </IconWrapper>
);

export const MaintenanceIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}>
        <g fill="url(#glass-gradient)">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </g>
    </IconWrapper>
);

export const SafetyIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}>
        <g fill="url(#glass-gradient)">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9.5 14.5 5-5"></path>
            <path d="m14.5 14.5-5-5"></path>
        </g>
    </IconWrapper>
);

export const SchedulingIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}>
        <g fill="url(#glass-gradient)">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </g>
    </IconWrapper>
);

export const ReportingIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </g>
  </IconWrapper>
);

export const NotificationsIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
       <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </g>
  </IconWrapper>
);

export const MusicIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
    </g>
  </IconWrapper>
);


export const WhatsNewIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0L12 2.69z" />
      <path d="M12 17.31V12" />
      <path d="M12 8.69h.01" />
    </g>
  </IconWrapper>
);

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => (
  <IconWrapper {...props}>
    <g fill="url(#glass-gradient)">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </g>
  </IconWrapper>
);

export const InventoryIcon = (props: SVGProps<SVGSVGElement>) => (
    <IconWrapper {...props}>
        <g fill="url(#glass-gradient)">
            <path d="M21 8V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v1" />
            <path d="M3 14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2" />
            <path d="M8 18h8" />
            <path d="M12 12v6" />
            <path d="M2 12h20" />
            <path d="m7 12 1-7h8l1 7" />
        </g>
    </IconWrapper>
);

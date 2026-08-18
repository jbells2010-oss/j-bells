export type IconName = 'shield'|'calendar'|'smartphone'|'wrench'|'battery'|'usb'|'camera'|'audio'|'cpu'|'scan'|'check'|'badge'|'search'|'whatsapp'|'instagram'|'youtube'|'arrowRight'|'arrowUpRight';
export function LineIcon({ name }: { name: IconName }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const paths: Record<IconName, React.ReactNode> = {
    shield:<><path {...common} d="M12 3 4.5 6v5c0 4.7 3.1 8.2 7.5 10 4.4-1.8 7.5-5.3 7.5-10V6L12 3Z"/><path {...common} d="m8.5 12 2.2 2.2 4.8-5"/></>,
    calendar:<><rect {...common} x="3.5" y="5" width="17" height="16" rx="2"/><path {...common} d="M7 3v4M17 3v4M3.5 9h17"/></>,
    smartphone:<><rect {...common} x="6.5" y="2.5" width="11" height="19" rx="2"/><path {...common} d="M10 18.5h5"/></>,
    wrench:<><path {...common} d="M14.5 6.5a4 4 0 0 0-5 5L4 17a2 2 0 1 0 2.8 2.8l5.5-5.5a4 4 0 0 0 5-5l-2.3 2.3-2.8-2.8 2.3-2.3Z"/></>,
    battery:<><rect {...common} x="4" y="6" width="15" height="12" rx="2"/><path {...common} d="M19 10h2v4h-2M8 12h7"/></>,
    usb:<><path {...common} d="M12 4v13M12 4l-2 2M12 4l2 2M12 17l-3 3M12 17l3 3"/><circle {...common} cx="9" cy="20" r="1"/><rect {...common} x="10" y="2" width="4" height="3" rx=".5"/></>,
    camera:<><path {...common} d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z"/><circle {...common} cx="12" cy="13.5" r="3.2"/></>,
    audio:<><path {...common} d="M4 10v4h3l5 4V6l-5 4H4ZM16 10a3 3 0 0 1 0 4M18.5 7.5a6.5 6.5 0 0 1 0 9"/></>,
    cpu:<><rect {...common} x="6" y="6" width="12" height="12" rx="1"/><rect {...common} x="9" y="9" width="6" height="6"/><path {...common} d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></>,
    scan:<><path {...common} d="M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4"/><circle {...common} cx="12" cy="12" r="3"/></>,
    search:<><circle {...common} cx="10.8" cy="10.8" r="6.3"/><path {...common} d="m16 16 4 4"/></>,
    check:<><circle {...common} cx="12" cy="12" r="9"/><path {...common} d="m8 12 2.5 2.5L16 9"/></>,
    badge:<><path {...common} d="m12 3 2.2 1.4 2.6-.1 1.1 2.3 2.1 1.5-.7 2.5.7 2.5-2.1 1.5-1.1 2.3-2.6-.1L12 18l-2.2-1.4-2.6.1-1.1-2.3L4 12.9l.7-2.5L4 7.9l2.1-1.5 1.1-2.3 2.6.1L12 3Z"/><path {...common} d="m8.5 10.5 2.2 2.2 4.8-4.8"/></>,
    arrowRight:<><path {...common} d="M4 12h15M13 6l6 6-6 6"/></>,
    arrowUpRight:<><path {...common} d="M5 19 19 5M9 5h10v10"/></>,
    instagram:<><rect {...common} x="4" y="4" width="16" height="16" rx="4"/><circle {...common} cx="12" cy="12" r="3.5"/><circle cx="17.5" cy="6.5" r=".7" fill="currentColor"/></>,
    youtube:<><rect {...common} x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path {...common} d="m10.5 9.5 5 2.5-5 2.5v-5Z"/></>,
    whatsapp:<><path {...common} d="M19.1 4.9A9.8 9.8 0 0 0 12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 19.1 4.9Z"/><path {...common} d="M8.2 7.8c.3-.3.7-.3 1-.1l1.2 1.8c.2.3.2.7-.1 1l-.6.6c.7 1.4 1.8 2.5 3.2 3.2l.6-.6c.3-.3.7-.3 1-.1l1.8 1.2c.3.2.3.7.1 1-.5.7-1.2 1-2 1-3.6-.4-6.8-3.6-7.2-7.2 0-.8.3-1.5 1-2Z"/></>,
  };
  return <svg className="line-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

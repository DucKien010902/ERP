export function Icon({ name, className = 'h-5 w-5' }) {
  const props = { className, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round', strokeLinejoin: 'round' };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>
      );
    case 'box':
      return (
        <svg {...props}><path d="M12 3 4 7l8 4 8-4-8-4Z" /><path d="M4 7v10l8 4 8-4V7" /><path d="M12 11v10" /></svg>
      );
    case 'folder':
      return <svg {...props}><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5v-10Z" /></svg>;
    case 'warehouse':
      return <svg {...props}><path d="M3 10.5 12 4l9 6.5" /><path d="M5 9.5V20h14V9.5" /><path d="M9 20v-6h6v6" /></svg>;
    case 'building':
      return <svg {...props}><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h4a1 1 0 0 1 1 1v11" /><path d="M8 7h2" /><path d="M8 11h2" /><path d="M8 15h2" /><path d="M12 7h2" /><path d="M12 11h2" /><path d="M12 15h2" /></svg>;
    case 'truck':
      return <svg {...props}><path d="M10 17h4" /><path d="M1 5h11v10H1z" /><path d="M12 8h4l3 3v4h-7" /><circle cx="6" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>;
    case 'clipboard':
      return <svg {...props}><rect x="6" y="4" width="12" height="17" rx="2" /><path d="M9 4.5h6a1 1 0 0 0 0-2H9a1 1 0 1 0 0 2Z" /><path d="M9 10h6" /><path d="M9 14h6" /></svg>;
    case 'receipt':
      return <svg {...props}><path d="M7 3h10v18l-3-2-2 2-2-2-3 2V3Z" /><path d="M9 8h6" /><path d="M9 12h6" /></svg>;
    case 'invoice':
      return <svg {...props}><path d="M7 3h10v18l-3-2-2 2-2-2-3 2V3Z" /><path d="M9 7h6" /><path d="M9 11h6" /><path d="M9 15h3" /></svg>;
    case 'layers':
      return <svg {...props}><path d="M12 3 3 8l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 16 9 5 9-5" /></svg>;
    case 'database':
      return <svg {...props}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>;
    case 'history':
      return <svg {...props}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /><path d="M12 7v5l4 2" /></svg>;
    case 'alert':
      return <svg {...props}><path d="M12 9v4" /><path d="M12 17h.01" /><path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0Z" /></svg>;
    case 'chart':
      return <svg {...props}><path d="M4 19V5" /><path d="M20 19H4" /><path d="M8 15v-4" /><path d="M12 15V9" /><path d="M16 15V6" /></svg>;
    case 'swap':
      return <svg {...props}><path d="M7 7h12" /><path d="m15 3 4 4-4 4" /><path d="M17 17H5" /><path d="m9 13-4 4 4 4" /></svg>;
    case 'users':
      return <svg {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M20 8v6" /><path d="M23 11h-6" /></svg>;
    case 'shield':
      return <svg {...props}><path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z" /></svg>;
    case 'key':
      return <svg {...props}><circle cx="8" cy="15" r="4" /><path d="M12 15h9" /><path d="M18 12v6" /><path d="M21 13v4" /></svg>;
    case 'scale':
      return <svg {...props}><path d="M12 3v18" /><path d="M6 7h12" /><path d="m6 7-3 6a3 3 0 0 0 6 0L6 7Z" /><path d="m18 7-3 6a3 3 0 0 0 6 0l-3-6Z" /><path d="M9 21h6" /></svg>;
    default:
      return <svg {...props}><circle cx="12" cy="12" r="8" /></svg>;
  }
}

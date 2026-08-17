"use strict";
(()=>{
 const icons={
  overview:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.8V21h13V9.8"/><path d="M9.5 21v-6h5v6"/></svg>',
  'client-payments':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.5-4 2.5-6 5.5-6s5 2 5.5 6"/><path d="M16 8h5M18.5 5.5 21 8l-2.5 2.5"/></svg>',
  'order-payment':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h10l3 3v15H6z"/><path d="M16 3v4h4M9 11h6M9 15h6"/></svg>',
  collections:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h10M7 13h4M16.5 12v4M14.5 14h4"/></svg>',
  deposits:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4zM3 10l9-6 9 6"/><path d="M8 13v4M12 13v4M16 13v4"/></svg>',
  'payment-queue':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h12M13 8l4 4-4 4"/><path d="M4 5h16v14H4z"/></svg>',
  'payment-records':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/></svg>',
  'ca-compliance':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2M8 3l-2 2M16 3l2 2"/></svg>',
  'accountable-forms':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h10v18H7zM10 7h4M10 11h4M10 15h4"/><path d="M4 6v12M20 6v12"/></svg>',
  reports:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5z"/><path d="M9 16v-4M12 16V8M15 16v-6"/></svg>',
  coa:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 20 6v6c0 5-3.3 8-8 9-4.7-1-8-4-8-9V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></svg>',
  archive:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v14H4zM3 3h18v4H3zM9 11h6"/></svg>',
  registry:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5"/></svg>',
  detail:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>',
  records:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h8"/></svg>',
  'tip-requests':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h5"/><path d="m15 15 2 2 3-4"/></svg>',
  'tip-schedule':'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 9h16M8 13h3M13 13h3"/></svg>',
  'tip-monitor':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 5-6"/></svg>',
  'review-queue':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5zM8 8h8M8 12h5"/><circle cx="16" cy="16" r="3"/></svg>',
  'review-detail':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="m8 12 2 2 5-5"/></svg>',
  rqm:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/><path d="M16 13h2v3h-2z"/></svg>',
  'dv-queue':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5zM8 8h8M8 12h8M8 16h4"/></svg>',
  'dv-detail':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3h14v18H5z"/><path d="M9 8h6M9 12h6"/><path d="m9 16 2 2 4-4"/></svg>',
  submission:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16v4H4zM7 17V5h10v12"/><path d="M9 9h6M9 13h6"/></svg>',
  queue:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M5 12h14M5 18h9"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>',
  funds:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16v11H4zM7 8V5h10v3"/><circle cx="12" cy="13.5" r="2.5"/></svg>',
  'process-monitor':'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><path d="M12 4V2M20 12h2M12 20v2M4 12H2"/></svg>',
  approvals:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="m8 12 2.5 2.5L16 9"/></svg>',
  compliance:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7L4 8"/><path d="M4 4v4h4M12 8v5l3 2"/></svg>'
 };
 document.querySelectorAll('.role-nav [data-role-screen]').forEach(btn=>{
   const host=btn.querySelector('.role-icon');
   const svg=icons[btn.dataset.roleScreen];
   if(host&&svg)host.innerHTML=svg;
 });
 const refresh=document.querySelector('.role-refresh');
 if(refresh)refresh.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5"/><path d="M19 11a7 7 0 1 0 1 5"/></svg>';
})();
NEXUS QUICK DEPLOY

1. Copy index.html to your TAESF/NEXUS public folder, replacing the existing landing page.
2. Copy the apps and concepts folders into public.
3. Keep the existing AIMS.html in the public root.
4. Copy the complete TALDMS project folder to public/TALDMS (its HTML depends on CSS, JS and Modules folders).
5. Copy the TITAN HTML to public/apps/TITAN.html when available, then change the TITAN card href from # to apps/TITAN.html.
6. Create public/assets/icons and add the suggested GIF filenames listed in ICON_FILENAMES.txt. The landing page uses animated emoji fallbacks when GIFs are absent.
7. Keep existing public/assets/Logo.png and public/assets/Background.jpg.
8. Deploy: firebase.cmd deploy --only hosting
9. Hard refresh: Ctrl+Shift+R

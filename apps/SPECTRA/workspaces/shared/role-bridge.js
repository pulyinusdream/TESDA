"use strict";
NEXUS_SPECTRA.Controllers.App=NEXUS_SPECTRA.Controllers.App||{};
NEXUS_SPECTRA.Controllers.App.refresh=()=>{window.ROLE_REFRESH?.(NEXUS_SPECTRA.Controllers.RoleRouter?.current?.()||"overview");NEXUS_SPECTRA.Controllers.Review?.refresh?.();NEXUS_SPECTRA.Controllers.Accounting?.refresh?.();NEXUS_SPECTRA.Controllers.Budget?.refresh?.();NEXUS_SPECTRA.Controllers.TIP?.refresh?.();NEXUS_SPECTRA.Controllers.DVJEV?.refresh?.();NEXUS_SPECTRA.Views.Compliance?.accounting?.();NEXUS_SPECTRA.Views.Compliance?.admin?.();};

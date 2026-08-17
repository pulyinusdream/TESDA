"use strict";
TAESF.NTTC.ControlNumberService=(()=>{
  const KEY="nttc.block3.control.sequences";
  function next(year){
    const y=Number(year||new Date().getFullYear());
    const seq=TAESF.NTTC.LocalStorage.get(KEY)||{};
    seq[y]=Number(seq[y]||0)+1;
    TAESF.NTTC.LocalStorage.set(KEY,seq);
    return `${TAESF.NTTC.Constants.CONTROL_PREFIX}-${y}-${String(seq[y]).padStart(6,"0")}`;
  }
  return Object.freeze({next});
})();

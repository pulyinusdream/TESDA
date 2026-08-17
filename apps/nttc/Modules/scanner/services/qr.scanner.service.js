"use strict";
TAESF.NTTC.QRScannerService=(()=>{
  let stream=null,detector=null,raf=0;
  function findApplication(value){const code=String(value||"").trim().toUpperCase();if(!code)return null;return TAESF.NTTC.ApplicationRepository.all().find(a=>String(a.controlNumber||"").toUpperCase()===code)||null;}
  function supported(){return "BarcodeDetector" in window;}
  async function start(video,onDetected,onError){if(!supported())throw new Error("Camera QR scanning is not supported by this browser. Use manual control-number search below.");detector=new BarcodeDetector({formats:["qr_code"]});stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});video.srcObject=stream;await video.play();const tick=async()=>{try{const codes=await detector.detect(video);if(codes.length){const raw=codes[0].rawValue||"";const app=findApplication(raw);if(app){stop();onDetected(app,raw);return;}}}catch(e){if(onError)onError(e);}raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(stream){stream.getTracks().forEach(t=>t.stop());stream=null;}detector=null;}
  return Object.freeze({supported,start,stop,findApplication});
})();

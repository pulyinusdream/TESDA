"use strict";
NEXUS_SAM.Services.Pdf = (()=>{
  function requirePdfJs(){
    if(!window.pdfjsLib) throw new Error("PDF reader library is not available. Check the internet connection or install PDF.js locally.");
    if(window.pdfjsLib.GlobalWorkerOptions){
      window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    }
    return window.pdfjsLib;
  }
  function groupItemsIntoLines(items){
    const rows=[];
    items.forEach(item=>{
      const text=(item.str||"").trim(); if(!text)return;
      const x=item.transform?.[4]||0, y=item.transform?.[5]||0;
      let row=rows.find(r=>Math.abs(r.y-y)<=2.5);
      if(!row){row={y,items:[]};rows.push(row);} row.items.push({x,text});
    });
    rows.sort((a,b)=>b.y-a.y);
    return rows.map(r=>r.items.sort((a,b)=>a.x-b.x).map(i=>i.text).join(" ").replace(/\s+/g," ").trim());
  }
  async function extract(file){
    const pdfjs=requirePdfJs();
    const bytes=new Uint8Array(await file.arrayBuffer());
    const pdf=await pdfjs.getDocument({data:bytes}).promise;
    const pages=[];
    for(let p=1;p<=pdf.numPages;p+=1){
      const page=await pdf.getPage(p); const content=await page.getTextContent();
      const lines=groupItemsIntoLines(content.items);
      pages.push({pageNumber:p,lines,text:lines.join("\n")});
    }
    return {name:file.name,size:file.size,pageCount:pdf.numPages,pages,text:pages.map(p=>p.text).join("\n")};
  }
  return Object.freeze({extract,groupItemsIntoLines});
})();

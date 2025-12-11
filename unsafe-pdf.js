import { jsPDF } from 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.es.min.js';


const secure_pdf_div = document.querySelector(".mod_securepdf_pageslinks");

if (!secure_pdf_div) {
  console.log("didnt found secure pdf");

}

console.log("found secure pdf");
main();



async function main (){
  const linki = secure_pdf_div.querySelectorAll('a');
  const images =  [];
  for (const item of linki) {
    console.log(item.href);
    const base64image = await getPicturebase64FromURL(item.href);
    //console.log(base64image);
    if (base64image) {
      images.push("data:image/jpeg;base64," + base64image);

      console.log("dodano obraz do listy: " + item.href);
    } else {
      console.log("Nie udało się pobrać obrazu z URL: " + item.href);
    }
    
  }
  if (images.length > 0) {
    console.log("Znaleziono obrazy: " + images.length);
    saveImages(images);
  }
}


function saveImages(images) {
  const pdf = new jsPDF();
  
  images.forEach((base64, index) => {
    if (index > 0) {
      pdf.addPage();
    }
    pdf.addImage(base64, 'JPEG', 10, 10, 190, 0);
  });
  
  pdf.save('slide.pdf');
}

async function getPicturebase64FromURL(url) {
  const regex = /data:image\/[a-zA-Z]+;base64,\s*([A-Za-z0-9+/=\r\n]+)/s;
  const response = await fetch(url,{
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!response.ok) throw new Error("BAD REQUEST")
  const raw = await response.text();
  const match = raw.match(regex);
  let base64image = null;
  if (match) {
    base64image = match[1];
    console.log("udało się ", base64image);
  }
  else console.log("nie udało się")

  
  return base64image;

}

function downloadImage(base64, filename = "slide.png") {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}



import puppeteer from "puppeteer";

export const createPDF = async (html) => {
  // start puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

    // configure html content 
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // generate PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' }
  });

  await browser.close();

  return pdfBuffer;
};
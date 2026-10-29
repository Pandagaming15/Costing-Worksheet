import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveOrShareFile } from './fileExporter';

export async function exportWorksheetToPdf(
  element: HTMLElement,
  productName: string = 'Cooked_Product'
): Promise<void> {
  const safeName = (productName.trim() || 'Cooked_Product')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);
  const fileName = `${safeName}_Costing_Worksheet.pdf`;

  // Temporarily force white background and standard text colors for clean render
  const originalBackground = element.style.background;
  const originalColor = element.style.color;
  element.style.background = '#ffffff';
  element.style.color = '#000000';

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1024,
      onclone: (clonedDoc) => {
        // Ensure PDF is always rendered with crisp white paper and pristine light mode styling
        clonedDoc.documentElement.classList.remove('dark');
        clonedDoc.body.classList.remove('dark');
        const clonedTarget = clonedDoc.getElementById('printable-worksheet');
        if (clonedTarget) {
          clonedTarget.classList.remove('dark');
          clonedTarget.style.backgroundColor = '#ffffff';
          clonedTarget.style.color = '#000000';
        }
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const totalPdfHeight = (canvasHeight * pdfWidth) / canvasWidth;

    let heightLeft = totalPdfHeight;
    let position = 0;

    // First Page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Subsequent Pages if content extends beyond one page
    while (heightLeft > 5) {
      position = -(totalPdfHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, totalPdfHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Generate binary blob and route through multi-tier saver
    // (Native Capacitor file cache + Android share intent, Web Share API, or browser download)
    const blob = pdf.output('blob');
    await saveOrShareFile({
      blob,
      fileName,
      mimeType: 'application/pdf',
      title: `${productName || 'Cooked Product'} Costing Worksheet PDF`,
      text: `Costing and Pricing Worksheet for ${productName || 'Cooked Product'} (PDF format)`,
    });
  } finally {
    element.style.background = originalBackground;
    element.style.color = originalColor;
  }
}

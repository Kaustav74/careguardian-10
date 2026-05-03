const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

exports.generatePrescriptionPdf = ({ appointmentId, doctorName, patientName, medicines, advice }) => new Promise((resolve, reject) => {
  const fileName = `prescription-${appointmentId}.pdf`;
  const outPath = path.join(__dirname, '..', 'generated', fileName);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);
  doc.fontSize(18).text('CareGuardian E-Prescription');
  doc.moveDown().fontSize(12).text(`Doctor: ${doctorName}`).text(`Patient: ${patientName}`);
  doc.moveDown().text(`Medicines: ${medicines || 'N/A'}`).text(`Advice: ${advice || 'N/A'}`);
  doc.end();
  stream.on('finish', () => resolve(`/generated/${fileName}`));
  stream.on('error', reject);
});

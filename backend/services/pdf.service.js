const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

exports.generateReportPDF = (report, user) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const filename = `report-${report._id}.pdf`;
            const filePath = path.join(__dirname, '../uploads', filename);
            const stream = fs.createWriteStream(filePath);

            doc.pipe(stream);

            // Aesthetic PDF Header
            doc.rect(0, 0, 612, 100).fill('#1a1a2e');
            doc.fillColor('#d4af37').fontSize(26).text('QUANTUM WITHIN', 50, 40, { align: 'center' });
            doc.fontSize(12).text('Cosmic Insights & Destiny Report', 50, 70, { align: 'center' });

            doc.moveDown(4);
            doc.fillColor('#000000').fontSize(18).text(`${report.type.toUpperCase()} REPORT`, { align: 'center', underline: true });
            doc.moveDown();

            doc.fontSize(12).text(`Generated for: ${user.name}`);
            doc.text(`Date: ${new Date().toLocaleDateString()}`);
            doc.text(`Tier: ${report.tier.toUpperCase()}`);
            doc.moveDown();

            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // Report Specific Content
            if (report.type === 'kundali') {
                doc.fontSize(14).text('Lagna Chart Summary', { bold: true });
                doc.fontSize(11).text(`Ascendant: ${report.result.lagnaChart.ascendant}`);
                doc.text(report.result.lagnaChart.description);
                doc.moveDown();

                doc.fontSize(14).text('Planet Positions', { bold: true });
                Object.entries(report.result.planetPositions).forEach(([planet, sign]) => {
                    doc.fontSize(11).text(`${planet}: ${sign}`);
                });
            } else if (report.type === 'numerology') {
                doc.fontSize(14).text('Key Numbers', { bold: true });
                doc.fontSize(11).text(`Life Path Number: ${report.result.lifePathNumber}`);
                doc.text(`Destiny Number: ${report.result.destinyNumber}`);
                doc.text(`Personality Number: ${report.result.personalityNumber}`);
                doc.moveDown();
                doc.fontSize(14).text('Life Path Meaning', { bold: true });
                doc.fontSize(11).text(report.result.lifePathMeaning);
            }

            // Legal Disclaimer
            doc.moveDown(5);
            doc.fontSize(8).fillColor('#666666').text(
                'LEGAL DISCLAIMER: For entertainment and personal insight purposes only. Not a substitute for professional, legal, or medical advice.',
                50, 700, { align: 'center' }
            );

            doc.end();

            stream.on('finish', () => resolve(`/uploads/${filename}`));
            stream.on('error', reject);
        } catch (err) {
            reject(err);
        }
    });
};

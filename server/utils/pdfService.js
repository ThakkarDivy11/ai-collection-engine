const PDFDocument = require("pdfkit");
const { calculateOverduePenalty } = require("./penaltyUtils");

const generateInvoicePDF = async (invoice) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.on("error", (err) => reject(err));

            // Header
            doc.fillColor("#444444").fontSize(20).text("CollectAI", 50, 57);
            doc.fontSize(10).text("Admin Systems • Secure Billing", 200, 65, { align: "right" });
            doc.moveDown();

            // Line
            doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, 90).lineTo(550, 90).stroke();

            // Invoice Info
            doc.fillColor("#444444").fontSize(20).text("INVOICE", 50, 110);
            doc.fontSize(10).text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 140);
            doc.text(`Invoice Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 155);
            doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 170);

            // Billing Details
            doc.fontSize(10).text("BILL TO:", 350, 140, { font: "Helvetica-Bold" });
            doc.text(invoice.clientId.name, 350, 155);
            doc.text(invoice.clientId.company, 350, 170);
            doc.text(invoice.clientId.email, 350, 185);

            // Table Header
            const tableTop = 230;
            doc.fillColor("#444444").fontSize(10);
            doc.text("Description", 50, tableTop, { font: "Helvetica-Bold" });
            doc.text("Amount", 450, tableTop, { align: "right", font: "Helvetica-Bold" });

            doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Table Content
            const { finalAmount, daysOverdue } = calculateOverduePenalty(invoice.amount, invoice.dueDate, invoice.status);
            const itemTop = tableTop + 30;
            doc.text("Enterprise Suite Subscription", 50, itemTop);
            doc.text(`INR ${finalAmount.toLocaleString()}`, 450, itemTop, { align: "right" });

            if (daysOverdue > 0) {
                doc.fontSize(8).fillColor("#777777").text("(Includes overdue charges)", 50, itemTop + 12);
            }

            // Total
            const totalTop = itemTop + 50;
            doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(350, totalTop).lineTo(550, totalTop).stroke();
            doc.fillColor("#444444").fontSize(12).text("TOTAL:", 350, totalTop + 15, { font: "Helvetica-Bold" });
            doc.text(`INR ${finalAmount.toLocaleString()}`, 450, totalTop + 15, { align: "right", font: "Helvetica-Bold" });

            // Footer
            doc.fontSize(10).fillColor("#aaaaaa").text("Thank you for your business!", 50, 700, { align: "center", width: 500 });

            // PAID Stamp
            if (invoice.status === "paid") {
                doc.save(); // Save state before rotation
                
                const stampX = 400;
                const stampY = 600;
                const stampWidth = 120;
                const stampHeight = 50;

                // Move origin and rotate for the stamped look
                doc.translate(stampX + stampWidth / 2, stampY + stampHeight / 2);
                doc.rotate(-20);
                doc.translate(-(stampX + stampWidth / 2), -(stampY + stampHeight / 2));

                // Stamp Border
                doc.strokeColor("#10b981") // Emerald-500
                   .lineWidth(3)
                   .roundedRect(stampX, stampY, stampWidth, stampHeight, 5)
                   .stroke();

                // Stamp Text
                doc.fillColor("#10b981")
                   .fontSize(24)
                   .font("Helvetica-Bold")
                   .text("PAID", stampX, stampY + 12, {
                       width: stampWidth,
                       align: "center"
                   });

                doc.restore(); // Restore state (reset rotation)
            }

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoicePDF };

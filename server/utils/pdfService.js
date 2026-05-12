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

            // Invoice/Receipt Info
            const title = invoice.status === "paid" ? "PAYMENT RECEIPT" : "INVOICE";
            const titleColor = invoice.status === "paid" ? "#10b981" : "#444444";
            
            doc.fillColor(titleColor).fontSize(24).font("Helvetica-Bold").text(title, 50, 110);
            doc.fillColor("#444444").fontSize(10).font("Helvetica");
            doc.text(`Number: ${invoice.invoiceNumber}`, 50, 140);
            doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 155);
            doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 170);

            // PAID Stamp (Top Right)
            if (invoice.status === "paid") {
                doc.save();
                const stampX = 420;
                const stampY = 100;
                const stampWidth = 110;
                const stampHeight = 45;

                doc.translate(stampX + stampWidth / 2, stampY + stampHeight / 2);
                doc.rotate(-15);
                doc.translate(-(stampX + stampWidth / 2), -(stampY + stampHeight / 2));

                // Outer border
                doc.strokeColor("#10b981").lineWidth(2.5).roundedRect(stampX, stampY, stampWidth, stampHeight, 4).stroke();
                // Inner border
                doc.strokeColor("#10b981").lineWidth(1).roundedRect(stampX + 3, stampY + 3, stampWidth - 6, stampHeight - 6, 2).stroke();

                doc.fillColor("#10b981").fontSize(20).font("Helvetica-Bold").text("PAID", stampX, stampY + 12, {
                    width: stampWidth,
                    align: "center"
                });
                doc.restore();
            }

            // Billing Details
            doc.fontSize(10).font("Helvetica-Bold").text("BILL TO:", 350, 140);
            if (invoice.clientId) {
                doc.font("Helvetica").text(invoice.clientId.name || "N/A", 350, 155);
                doc.text(invoice.clientId.company || "N/A", 350, 170);
                doc.text(invoice.clientId.email || "N/A", 350, 185);
            } else {
                doc.font("Helvetica").text("Unknown Client", 350, 155);
                doc.text("Company N/A", 350, 170);
            }

            // Table Header
            const tableTop = 240;
            doc.fillColor("#444444").fontSize(10).font("Helvetica-Bold");
            doc.text("Description", 50, tableTop);
            doc.text("Amount", 450, tableTop, { align: "right" });

            doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Table Content
            const { finalAmount, daysOverdue } = calculateOverduePenalty(invoice.amount, invoice.dueDate, invoice.status);
            const itemTop = tableTop + 30;
            doc.font("Helvetica").text("Enterprise Suite Subscription / Service Payment", 50, itemTop);
            doc.text(`INR ${finalAmount.toLocaleString()}`, 450, itemTop, { align: "right" });

            if (daysOverdue > 0) {
                doc.fontSize(8).fillColor("#777777").text("(Includes overdue charges if applicable)", 50, itemTop + 12);
            }

            // Total Section
            const totalTop = itemTop + 60;
            doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(350, totalTop).lineTo(550, totalTop).stroke();
            
            doc.fillColor("#444444").fontSize(12).font("Helvetica-Bold").text("TOTAL AMOUNT:", 350, totalTop + 15);
            doc.text(`INR ${finalAmount.toLocaleString()}`, 450, totalTop + 15, { align: "right" });

            if (invoice.status === "paid") {
                doc.fontSize(10).fillColor("#10b981").text("PAYMENT RECEIVED SUCCESSFULLY", 350, totalTop + 40, { align: "right", font: "Helvetica-Bold" });
            }

            // Footer
            doc.fontSize(9).fillColor("#aaaaaa").font("Helvetica").text("This is a computer-generated receipt and does not require a physical signature.", 50, 700, { align: "center", width: 500 });
            doc.text("Thank you for using CollectAI Agentic Systems.", 50, 715, { align: "center", width: 500 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoicePDF };

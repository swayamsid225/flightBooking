const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generatePDF = async (booking, user, flight) => {
  return new Promise((resolve, reject) => {
    try {
      const ticketsDir = path.join(__dirname, "../tickets");
      if (!fs.existsSync(ticketsDir)) {
        fs.mkdirSync(ticketsDir, { recursive: true });
      }

      const filename = `ticket-${booking.pnr}.pdf`;
      const filepath = path.join(ticketsDir, filename);

      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      /* ================= HEADER ================= */
      doc
        .rect(0, 0, doc.page.width, 90)
        .fill("#0f172a");

      doc
        .fillColor("#ffffff")
        .fontSize(26)
        .text("FLIGHT TICKET", 50, 30);

      doc
        .fontSize(12)
        .text(`PNR: ${booking.pnr}`, doc.page.width - 200, 35);

      doc.moveDown(4);
      doc.fillColor("#000");

      /* ================= BOOKING INFO ================= */
      doc
        .fontSize(12)
        .text(`Booking Date: ${booking.createdAt.toLocaleString()}`, {
          align: "right",
        });

      doc.moveDown();

      /* ================= PASSENGER ================= */
      sectionTitle(doc, "PASSENGER DETAILS");
      twoColumn(doc, "Name", user.name, "Email", user.email);

      /* ================= FLIGHT ================= */
      sectionTitle(doc, "FLIGHT DETAILS");
      twoColumn(
        doc,
        "Airline",
        flight.airline,
        "Flight No",
        flight.flight_id
      );

      twoColumn(
        doc,
        "From",
        flight.departure_city,
        "To",
        flight.arrival_city
      );

      twoColumn(
        doc,
        "Seat",
        "Auto Assigned",
        "Class",
        "Economy"
      );

      /* ================= PAYMENT ================= */
      sectionTitle(doc, "PAYMENT SUMMARY");
      doc
        .fontSize(14)
        .text(`Amount Paid: ₹${booking.amount_paid}`, { align: "right" });

      doc.moveDown(2);

      /* ================= FOOTER ================= */
      doc
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .strokeColor("#ccc")
        .stroke();

      doc.moveDown();

      doc
        .fontSize(10)
        .fillColor("#555")
        .text(
          "Please carry a valid government ID along with this ticket.\nThank you for choosing our airline.",
          { align: "center" }
        );

      doc.end();

      stream.on("finish", () => resolve(filepath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

/* ================= HELPERS ================= */

function sectionTitle(doc, title) {
  doc.moveDown(1.5);
  doc.fontSize(14).fillColor("#0f172a").text(title);
  doc
    .moveTo(50, doc.y + 2)
    .lineTo(doc.page.width - 50, doc.y + 2)
    .strokeColor("#0f172a")
    .stroke();
  doc.moveDown();
}

function twoColumn(doc, leftLabel, leftValue, rightLabel, rightValue) {
  const startY = doc.y;

  doc.fontSize(11).fillColor("#000");
  doc.text(`${leftLabel}:`, 50, startY, { continued: true });
  doc.text(` ${leftValue}`, { width: 200 });

  doc.text(`${rightLabel}:`, 300, startY, { continued: true });
  doc.text(` ${rightValue}`, { width: 200 });

  doc.moveDown();
}

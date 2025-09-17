import { jsPDF } from "jspdf";

function Confirmation({
  orderId,
  room,
  camp,
  slot,
  pickup,
  selectedItems,
  total,
  customerName,
  specialInstructions,
}) {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set initial positions and styles
    let yPosition = 50; // Increased to make space for logo
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Add logo (base64 encoded image)
    const logoUrl = "/ama_2.png";

    // Convert image to base64 and add to PDF
    const img = new Image();
    img.src = logoUrl;
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataURL = canvas.toDataURL("image/png");

      // Add logo to PDF (scaled to appropriate size)
      doc.addImage(dataURL, "PNG", pageWidth / 2 - 25, 15, 50, 20);

      // Continue with the rest of the PDF creation
      // Add header
      doc.setFontSize(20);
      doc.setTextColor(40, 40, 40);
      doc.text("Booking Confirmation", pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Thank you for your order, ${customerName || "Valued Customer"}!`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );
      yPosition += lineHeight;
      doc.text(`Order ID: #${orderId}`, pageWidth / 2, yPosition, {
        align: "center",
      });
      yPosition += 15;

      // Order Details section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Order Details", margin, yPosition);
      yPosition += lineHeight + 2;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);

      // Order details rows
      const details = [
        { label: "Camp", value: camp },
        { label: "Room", value: room },
        { label: "Pickup Slot", value: slot },
        { label: "Pickup Method", value: pickup },
      ];

      details.forEach((detail) => {
        if (detail.value) {
          doc.setTextColor(60, 60, 60);
          doc.setFont(undefined, "bold");
          doc.text(`${detail.label}:`, margin, yPosition);

          doc.setTextColor(80, 80, 80);
          doc.setFont(undefined, "normal");
          doc.text(detail.value, margin + 40, yPosition);

          yPosition += lineHeight;
        }
      });

      // Special instructions
      if (specialInstructions) {
        yPosition += 3;
        doc.setTextColor(60, 60, 60);
        doc.setFont(undefined, "bold");
        doc.text("Special Instructions:", margin, yPosition);
        yPosition += lineHeight;

        // Handle long text with word wrap
        const splitInstructions = doc.splitTextToSize(
          specialInstructions,
          pageWidth - margin * 2
        );
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, "normal");
        doc.text(splitInstructions, margin, yPosition);
        yPosition += splitInstructions.length * lineHeight;
      }

      yPosition += 10;

      // Selected Services section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Selected Services", margin, yPosition);
      yPosition += lineHeight + 2;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 8;

      doc.setFontSize(12);

      // Service items
      selectedItems.forEach((entry, index) => {
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        const itemName = entry.item.name;
        const quantity = entry.quantity;
        const price = entry.item.price.toFixed(2);
        const itemTotal = (entry.item.price * entry.quantity).toFixed(2);

        // Item name
        doc.setTextColor(60, 60, 60);
        doc.setFont(undefined, "bold");
        const splitName = doc.splitTextToSize(
          itemName,
          pageWidth - margin - 80
        );
        doc.text(splitName, margin, yPosition);

        // Quantity and price
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, "normal");
        doc.text(
          `${quantity} x $${price} = $${itemTotal}`,
          pageWidth - margin,
          yPosition,
          { align: "right" }
        );

        yPosition += splitName.length * lineHeight + 2;

        // Add separator line if not last item
        if (index < selectedItems.length - 1) {
          doc.setDrawColor(240, 240, 240);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 5;
        }
      });

      yPosition += 10;

      // Total
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.setFont(undefined, "bold");
      doc.text("Total:", pageWidth - margin - 40, yPosition);
      doc.text(`$${total.toFixed(2)}`, pageWidth - margin, yPosition, {
        align: "right",
      });

      yPosition += 15;

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        pageWidth / 2,
        yPosition,
        { align: "center" }
      );

      // Save the PDF
      doc.save(`laundry-confirmation-${orderId}.pdf`);
    };
  };

  return (
    <div className="confirmation">
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1.5rem",
        }}
      >
        Booking Confirmed!
      </h2>
      <div
        style={{
          backgroundColor: "#f3f4f6",
          padding: "1.5rem",
          borderRadius: "0.5rem",
        }}
      >
        <p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Thank you for your order, {customerName || "Valued Customer"}!
        </p>
        <p style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          Your Order ID is: #{orderId}
        </p>

        {/* Download Button */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <button
            onClick={handleDownloadPDF}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              fontWeight: "500",
              padding: "0.5rem 1rem",
              borderRadius: "0.25rem",
              transition: "background-color 0.2s",
              border: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            Download Confirmation (PDF)
          </button>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              Order Details
            </h4>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Camp:</p>
                <p>{camp}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Room:</p>
                <p>{room}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Pickup Slot:</p>
                <p>{slot}</p>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <p>Pickup Method:</p>
                <p>{pickup}</p>
              </div>
              {specialInstructions && (
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <p>Special Instructions:</p>
                  <p>{specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
              Selected Services
            </h4>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {selectedItems.map((entry) => (
                <div
                  key={entry.item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>{entry.item.name}</p>
                    <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                      {entry.quantity} x ${entry.item.price.toFixed(2)}
                    </p>
                  </div>
                  <p>${(entry.item.price * entry.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "1.25rem",
            }}
          >
            <p>Total:</p>
            <p>${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Confirmation;

let registrationNumbers = [];

async function fetchRegistrationNumbers() {
  try {
    const response = await fetch("registrations.txt");
    if (response.ok) {
      const data = await response.text();
      registrationNumbers = data.split("\n").filter(Boolean);
      console.log("Fetched registration numbers:", registrationNumbers);
    } else {
      console.error("Failed to fetch registration numbers");
      alert("Failed to fetch registration numbers");
    }
  } catch (error) {
    console.error("Error fetching registration numbers:", error);
    alert("Error fetching registration numbers");
  }
}

function generateQRCode() {
  const qrcodeContainer = document.getElementById("qrcode");
  qrcodeContainer.innerHTML = ""; // Clear previous QR codes

  registrationNumbers.forEach((number) => {
    const qrCodeDiv = document.createElement("div");
    new QRCode(qrCodeDiv, {
      text: number,
      width: 128,
      height: 128,
    });
    qrcodeContainer.appendChild(qrCodeDiv);
  });
}

// Fetch registration numbers when the page loads
window.onload = fetchRegistrationNumbers;

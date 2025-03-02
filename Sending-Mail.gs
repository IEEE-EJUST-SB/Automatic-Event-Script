function sendQREmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var lastRow = sheet.getLastRow();
  var statusColumnIndex = 9; // Column J (Status column)
  
  for (var i = 1; i < lastRow; i++) {
    var name = data[i][1]; // Name in column C
    var email = data[i][2]; // Email in column D
    var userIdColumnIndex = 7; // Column H
    var qrColumnIndex = 8; // Column I
    
    var userId = data[i][userIdColumnIndex];
    var qrUrl = data[i][qrColumnIndex];
    
    if (data[i][statusColumnIndex] !== "Sent" && qrUrl) { // Send only if not sent and QR exists
      var subject = "Your Event Ticket - Confirmation";
      var body = `Hello ${name},\n\nHere is your event ticket.\n\nUser ID: ${userId}\n\nYou can access your QR code here: ${qrUrl}\n\nBest regards,\nEvent Team`;
      
      GmailApp.sendEmail(email, subject, body);
      
      sheet.getRange(i + 1, statusColumnIndex + 1).setValue("Sent"); // Mark email as sent
    }
  }
}

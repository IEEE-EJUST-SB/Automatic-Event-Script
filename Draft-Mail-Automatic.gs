function sendQREmailsFromDraft() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var lastRow = sheet.getLastRow();
  var statusColumnIndex = 9; // Column J (Status column)
  var draftMessage = getDraftTemplate(); // Fetch draft email template
  
  if (!draftMessage) {
    Logger.log("No draft template found!");
    return;
  }
  
  for (var i = 1; i < lastRow; i++) {
    var name = data[i][2]; // Name in column C
    var email = data[i][3]; // Email in column D
    var userIdColumnIndex = 7; // Column H
    var qrColumnIndex = 8; // Column I
    
    var userId = data[i][userIdColumnIndex];
    var qrUrl = data[i][qrColumnIndex];
    
    if (data[i][statusColumnIndex] !== "Sent" && qrUrl) { // Send only if not sent and QR exists
      var emailBody = draftMessage
        .replace("{{name}}", name)
        .replace("{{userId}}", userId)
        .replace("{{qrCode}}", `<img src='${qrUrl}' width='150'>`);
      
      GmailApp.sendEmail(email, "Your Event Ticket - Confirmation", "", {
        htmlBody: emailBody
      });
      
      sheet.getRange(i + 1, statusColumnIndex + 1).setValue("Sent"); // Mark email as sent
    }
  }
}

function getDraftTemplate() {
  var drafts = GmailApp.getDrafts();
  for (var i = 0; i < drafts.length; i++) {
    var draft = drafts[i];
    if (draft.getMessage().getSubject() === "Your Event Ticket - Template") { // Match by subject
      return draft.getMessage().getBody(); // Return the HTML body of the draft
    }
  }
  return null; // Return null if no template is found
}

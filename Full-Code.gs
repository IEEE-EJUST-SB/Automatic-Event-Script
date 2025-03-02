function generateQRCodesAndSendEmails() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var lastRow = sheet.getLastRow();
  var folderId = "13YXY1OT7HER0niPT0Ggm59dcV98R_KC9"; // Replace with your Google Drive Folder ID
  var folder = DriveApp.getFolderById(folderId); // Get the folder where QR codes will be saved
  
  // Assuming you have a header image in Drive
  var headerImageFile = DriveApp.getFileById('1fQ4zgFk2Ne9QbKUeN2-G9xiaxBPlJRs3'); // Replace with your header image file ID
  
  for (var i = 1; i < lastRow; i++) {
    var name = data[i][2]; // Name in column C
    var email = data[i][3]; // Email in column D
    var userIdColumnIndex = 7; // Column H
    var qrColumnIndex = 8; // Column I
    var statusColumnIndex = 9; // Column J

    var userId = data[i][userIdColumnIndex]; // Get existing User ID

    // If no user ID exists, generate one and save it
    if (!userId) {
      userId = "GEN" + (i); // Generate unique User ID
      sheet.getRange(i + 1, userIdColumnIndex + 1).setValue(userId);
    }

    var qrFile = null; // To store the QR code file reference

    if (!data[i][qrColumnIndex]) { // Generate QR if empty
      var qrData = `GENSTART VOL2\nUser ID: ${userId}\nName: ${name}\nEmail: ${email}`;
      var qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=300`;

      // Fetch the generated QR code image
      var response = UrlFetchApp.fetch(qrUrl);
      var blob = response.getBlob().setName(userId + ".png"); // Set filename with User ID
      
      // Save QR code in Google Drive
      qrFile = folder.createFile(blob);
      var fileUrl = qrFile.getUrl(); // Get the file's URL
      
      // Save the Google Drive link in the sheet
      sheet.getRange(i + 1, qrColumnIndex + 1).setValue(fileUrl);
    } else {
      // Get the existing QR code file
      qrFile = DriveApp.getFileById(data[i][qrColumnIndex].match(/[-\w]{25,}/)[0]);
      Logger.log("QR code already exists.");
    }

    if (data[i][statusColumnIndex] !== "Sent") { // Check if email was already sent
      // Fetch Gmail draft as the email template
      var draftMessage = getDraftTemplate();
      if (!draftMessage) {
        Logger.log("No draft template found!");
        return;
      }

      // Replace placeholders in the draft with actual data
      var emailBody = draftMessage
        .replace("{{name}}", name)
        .replace("{{userId}}", userId);

      // Embed QR code image in the email
      var imageCid = "qrCodeImage";
      emailBody = emailBody.replace("{{qrCode}}", `<img src="cid:${imageCid}" width="100">`);

      // Embed header image in the email (using its CID reference)
      var headerImageCid = "headerImage";
      emailBody = emailBody.replace("{{headerImage}}", `<img src="cid:${headerImageCid}" width="580">`);

      // Send email using GmailApp with inline images
      GmailApp.sendEmail(email, "Your Event Ticket - Confirmation", "", {
        htmlBody: emailBody,
        inlineImages: {
          [imageCid]: qrFile.getBlob(),  // Attach QR code image
          [headerImageCid]: headerImageFile.getBlob()  // Attach header image
        }
      });

      sheet.getRange(i + 1, statusColumnIndex + 1).setValue("Sent"); // Mark email as sent
    }
  }
}

/**
 * Fetches the draft template content from Gmail.
 * Replace this with your saved template's subject line.
 */
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

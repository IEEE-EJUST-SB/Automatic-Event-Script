function generateQRCodes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Form Responses 1");
  var data = sheet.getDataRange().getValues();
  var lastRow = sheet.getLastRow();
  var folderId = "1H-RhLIMPzSXNV9es48f_fdjuvyJXeqvj"; // Replace with your Google Drive Folder ID
  var folder = DriveApp.getFolderById(folderId); // Get the folder where QR codes will be saved

  for (var i = 1; i < lastRow; i++) {
    var name = data[i][1]; // Name in column C
    var email = data[i][2]; // Email in column D
    var userIdColumnIndex = 7; // Column H
    var qrColumnIndex = 8; // Column I
    
    var userId = data[i][userIdColumnIndex]; // Get existing User ID

    // If no user ID exists, generate one and save it
    if (!userId) {
      userId = "GEN" + (i); // Generate unique User ID
      sheet.getRange(i + 1, userIdColumnIndex + 1).setValue(userId);
    }

    if (!data[i][qrColumnIndex]) { // Generate QR if empty
      var qrData = `GENSTART VOL2\nUser ID: ${userId}\nName: ${name}\nEmail: ${email}`;
      var qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=300`;

      // Fetch the generated QR code image
      var response = UrlFetchApp.fetch(qrUrl);
      var blob = response.getBlob().setName(userId + ".png"); // Set filename with User ID
      
      // Save QR code in Google Drive
      var qrFile = folder.createFile(blob);
      var fileUrl = qrFile.getUrl(); // Get the file's URL
      
      // Save the Google Drive link in the sheet
      sheet.getRange(i + 1, qrColumnIndex + 1).setValue(fileUrl);
    }
  }
}

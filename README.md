# IEEE-EJUST-SB Automatic Script

## Overview
This repository contains an automated script designed for managing event registrations, generating QR codes, and sending confirmation emails for IEEE-EJUST-SB. The script automates the process of:
- Generating unique User IDs
- Creating QR codes for registered participants
- Sending personalized emails with embedded QR codes
- Sending Customized mails from ready drafts on Gmail

## Repository Structure
- **Full-Code.gs** – The main script that integrates all functionalities.
- **Draft-Mail-Automatic.gs** – Retrieves and processes Gmail draft templates for email automation.
- **QR-Code.gs** – Handles the generation and storage of QR codes.
- **Sending-Mail.gs** – Manages the email-sending process.

## Features
- **Automated QR Code Generation**: Uses QuickChart API to generate QR codes and stores them in Google Drive.
- **Email Automation**: Fetches draft templates and sends personalized emails to registrants.
- **Google Sheets Integration**: Retrieves participant details and updates registration status dynamically.
- **Drive Integration**: Stores QR codes and fetches necessary assets like header images.

## Usage
1. **Set up Google Sheets**:
   - Ensure your sheet contains columns for Name, Email, User ID, QR Code URL, and Email Status.
2. **Update Script with Folder & File IDs**:
   - Replace Google Drive folder and file IDs in the script.
3. **Prepare Gmail Draft Template**:
   - Create a Gmail draft with placeholders (`{{name}}`, `{{userId}}`, `{{qrCode}}`).
4. **Run the Script**:
   - Execute `generateQRCodesAndSendEmails()` in Google Apps Script.
5. **Check Email Status**:
   - Ensure the script updates the status column after sending emails.

## Requirements
- Google Apps Script (GAS)
- Google Sheets
- Gmail
- Google Drive API Access

## Contribution
Feel free to contribute by improving the script or adding new features. Fork the repo and submit a pull request!

## License
This project is for internal use within IEEE-EJUST-SB.

# GitEase Extension

## Overview
GitEase is a Chrome extension designed to streamline your GitHub workflow. It provides enhanced functionality by integrating with your GitHub account using a personal access token.

## Features
- Simplified GitHub repository management.(workining on the feaature)
- Quick access to repository details.
- Enhanced productivity with GitHub API integration.

## Installation and Setup

### Step 1: Generate a GitHub Token
1. Log in to your GitHub account.
2. Navigate to **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**.
3. Click **Generate new token**.
4. Select the required scopes (e.g., `repo`, `read:org`) and generate the token.
5. Copy the token and save it securely.

### Step 2: Load the Extension in Chrome
1. Clone or download the GitEase extension repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **Load unpacked** and select the folder containing the extension files.
5. The extension will now appear in your Chrome toolbar.

### Step 3: Configure the Extension
1. Click on the GitEase icon in the Chrome toolbar.
2. Paste your GitHub token into the input field and save. 
open the popup.js file and paaste the github to the variable called GITHUB_TOKEN
3. Start using GitEase to enhance your GitHub experience!

## Notes
- Keep your GitHub token private and do not share it with others.
- For any issues or feature requests, please open an issue in the repository.

Enjoy using GitEase!

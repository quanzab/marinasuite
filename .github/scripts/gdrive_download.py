import json, io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

# Define constants
FOLDER_ID = '1FznsPANU4xNXHIlkdcJh_y-YXEdbG-do'  # Your shared folder ID
FILENAME = 'MarinaSuite.zip'  # Exact name of the file

# Load service account credentials
creds = service_account.Credentials.from_service_account_file('service_account.json')
service = build('drive', 'v3', credentials=creds)

# List and print all files in the folder (for debugging)
query = f"'{FOLDER_ID}' in parents and trashed = false"
results = service.files().list(q=query, fields="files(id, name)").execute()
items = results.get('files', [])

print("📂 Files found in folder:")
for item in items:
    print(f"- {item['name']}")

# Search for the target file
file_id = None
for item in items:
    if item['name'] == FILENAME:
        file_id = item['id']
        break

if not file_id:
    raise Exception(f"{FILENAME} not found in folder {FOLDER_ID}")

# Download the file
request = service.files().get_media(fileId=file_id)
fh = io.FileIO(FILENAME, 'wb')
downloader = MediaIoBaseDownload(fh, request)

done = False
while not done:
    status, done = downloader.next_chunk()
    if status:
        print(f"Download {int(status.progress() * 100)}%")

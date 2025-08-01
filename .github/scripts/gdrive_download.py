import json, io
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

FOLDER_ID = '1FznsPANU4xNXHIlkdcJh_y-YXEdbG-do'  # Your shared folder ID
FILENAME = 'MarinaSuite.zip'  # Exact name of the file

creds = service_account.Credentials.from_service_account_file('service_account.json')
service = build('drive', 'v3', credentials=creds)

query = f"name='{FILENAME}' and '{FOLDER_ID}' in parents and trashed=false"
results = service.files().list(q=query, spaces='drive', fields='files(id, name)').execute()
files = results.get('files', [])

if not files:
    raise Exception(f"{FILENAME} not found in folder {FOLDER_ID}")

file_id = files[0]['id']
request = service.files().get_media(fileId=file_id)
fh = io.FileIO(FILENAME, 'wb')
downloader = MediaIoBaseDownload(fh, request)

done = False
while not done:
    status, done = downloader.next_chunk()
    if status:
        print(f"Download {int(status.progress() * 100)}%")

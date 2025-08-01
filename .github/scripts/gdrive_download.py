import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
import io
from googleapiclient.http import MediaIoBaseDownload

FOLDER_ID = '1FznsPANU4xNXHIlkdcJh_y-YXEdbG-do'

creds = service_account.Credentials.from_service_account_file('service_account.json')
drive = build('drive', 'v3', credentials=creds)

results = drive.files().list(
    q=f"name='MarinaSuite.zip' and '{FOLDER_ID}' in parents and trashed=false",
    spaces='drive',
    fields='files(id, name)'
).execute()

files = results.get('files', [])
if not files:
    raise Exception("MarinaSuite.zip not found in Google AI Studio folder")

file_id = files[0]['id']
request = drive.files().get_media(fileId=file_id)
fh = io.FileIO('marinasuite.zip', 'wb')
downloader = MediaIoBaseDownload(fh, request)

done = False
while not done:
    status, done = downloader.next_chunk()
    if status:
        print(f"Download progress: {int(status.progress() * 100)}%")

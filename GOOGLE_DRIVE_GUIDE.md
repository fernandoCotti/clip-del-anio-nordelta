# Google Drive Video Upload Guide

The tournament application now supports Google Drive videos! This allows you to upload videos directly to Google Drive and use them in the tournament.

## How to Use Google Drive Videos

### Step 1: Upload Video to Google Drive
1. Go to [Google Drive](https://drive.google.com)
2. Upload your video file (supports common video formats: MP4, MOV, AVI, etc.)

### Step 2: Share the Video
1. Right-click on the uploaded video file
2. Click "Share" or "Get link"
3. Set sharing permissions to **"Anyone with the link can view"**
4. Copy the sharing link

The link will look like one of these formats:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
https://drive.google.com/file/d/FILE_ID/view
```

### Step 3: Add to Tournament
1. Go to the admin panel (`/admin`)
2. Navigate to the "Videos" tab
3. Paste the Google Drive sharing link in the "URL de embed" field
4. The application will automatically convert it to the correct embed format

## Supported Link Formats

The application automatically handles these Google Drive link formats:
- ✅ Sharing links: `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
- ✅ Direct file links: `https://drive.google.com/file/d/FILE_ID/view`
- ✅ Preview links: `https://drive.google.com/file/d/FILE_ID/preview`

All formats will be converted to the embed format automatically.

## Important Notes

⚠️ **Sharing Settings**: Make sure your video is set to "Anyone with the link can view" for it to work properly in the tournament.

⚠️ **File Size**: Google Drive has file size limits depending on your account type:
- Free accounts: 15 GB total storage
- Google Workspace: Varies by plan

⚠️ **Video Format**: Google Drive supports most common video formats. For best compatibility, use MP4 format.

## Supported Platforms

The application now supports:
- ✅ YouTube (all formats)
- ✅ Vimeo
- ✅ Google Drive

You can mix and match videos from different platforms in the same tournament!

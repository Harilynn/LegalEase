# Firestore Security Rules for LegalEase

Copy and paste these rules into your Firebase Console -> Firestore Database -> Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own documents
    match /documents/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## How to apply these rules:

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select your LegalEase project
3. Click on "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with the rules above
6. Click "Publish" to save the changes

These rules ensure that:
- Only authenticated users can access the database
- Users can only read/write their own user profiles
- Users can only read/write documents they own (where userId matches their authentication ID)
- Users can create new documents with their own userId
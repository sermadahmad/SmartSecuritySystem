# API Integration Documentation

## Overview
This document explains the API integration implemented in the Smart Security System React Native app for sending security alerts with base64-encoded images.

## Architecture

### Files Added/Modified:
1. `src/utils/imageUtils.ts` - Base64 image conversion utilities
2. `src/api/apiService.ts` - API service layer with retry logic
3. `src/api/send_security_alert.ts` - Core API function (existing)
4. `src/api/endpoints.ts` - API endpoints configuration (modified)
5. `src/utils/notifications.ts` - User notification utilities
6. `src/components/APITestComponent.tsx` - Testing component
7. `src/components/Home/PanicButton.tsx` - Modified to include API calls
8. `src/hooks/useSecurityLogic.ts` - Modified to include API calls
9. `src/context/SecurityProvider.tsx` - Modified to pass contacts data

## Key Features

### 1. Image to Base64 Conversion
```typescript
// Convert single image
const base64Image = await convertImageToBase64(imagePath);

// Convert multiple images
const base64Images = await convertMultipleImagesToBase64(imagePaths);

// Prepare images for API (max 2 images)
const { image1, image2 } = await prepareImagesForAPI(imagePaths);
```

### 2. API Service with Retry Logic
```typescript
const apiResponse = await sendSecurityAlertToContacts({
  eventType: 'Panic Button',
  date: now.toLocaleDateString(),
  time: now.toLocaleTimeString(),
  location: locationLink,
  photoURIs: photoResult,
  userId: userId,
  contacts: contacts
});
```

### 3. Contact Preferences
The system respects individual contact preferences:
- `sendEventDetails`: Whether to send alerts to this contact
- `sendLocation`: Whether to include location data
- `sendPhotos`: Whether to include captured photos

## Integration Points

### 1. Panic Button
When the panic button is triggered:
1. Security photos are captured
2. Location is obtained
3. Event is saved to Firestore
4. Security alerts are sent to eligible contacts via API
5. User receives feedback on success/failure

### 2. Unauthorized Access Detection
When unauthorized access is detected:
1. Alarm is triggered
2. Security photos are captured automatically
3. Location is obtained
4. Event is saved to Firestore
5. Security alerts are sent to eligible contacts via API

## API Payload Format

```typescript
{
  to: string;           // Contact email
  eventType: string;    // 'Panic Button' | 'Unauthorized Access'
  date: string;         // Event date
  time: string;         // Event time
  mapsUrl: string;      // Google Maps link or location message
  image1: string;       // Base64 encoded image (data:image/jpeg;base64,...)
  image2: string;       // Base64 encoded image (data:image/jpeg;base64,...)
}
```

## Configuration

### API Endpoint
Update `src/api/endpoints.ts`:
```typescript
export const API_BASE_URL = 'https://your-api-server.com';
```

### Testing
Use the `APITestComponent` to test the integration:
1. Import and add to a screen
2. Test API connectivity
3. Test image conversion

## Error Handling

### 1. Image Conversion Errors
- File not found: Continues with empty image
- Conversion failure: Logs error and continues
- Multiple images: Processes remaining images if one fails

### 2. API Errors
- Network failure: Retry logic with exponential backoff
- Server errors: Logged and user notified
- Partial success: Reports successful and failed contacts

### 3. User Feedback
- Success: Shows number of alerts sent
- Failure: Shows error message with retry suggestion
- Partial success: Shows mixed results

## Dependencies

Required packages (already included):
- `react-native-fs`: For file system operations and base64 conversion
- `@react-native-firebase/firestore`: For event logging
- `@react-native-async-storage/async-storage`: For user ID management

## Usage Examples

### Manual API Test
```typescript
import { sendSecurityAlert } from './api/send_security_alert';

const testData = {
  to: 'user@example.com',
  eventType: 'Test Alert',
  date: '2025-01-01',
  time: '12:00:00',
  mapsUrl: 'https://maps.google.com/?q=40.7128,-74.0060',
  image1: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABA...',
  image2: ''
};

const response = await sendSecurityAlert(testData);
```

### Integration in Components
```typescript
import { sendSecurityAlertToContacts } from '../api/apiService';

const alertData = {
  eventType: 'Panic Button',
  date: new Date().toLocaleDateString(),
  time: new Date().toLocaleTimeString(),
  location: locationLink,
  photoURIs: capturedPhotos,
  userId: currentUserId,
  contacts: userContacts
};

const result = await sendSecurityAlertToContacts(alertData);
```

## Security Considerations

1. **Base64 Size**: Large images increase payload size and transmission time
2. **API Limits**: Consider server limits for payload size and request frequency
3. **Error Logging**: Sensitive data is not logged in production
4. **Retry Logic**: Prevents spam with exponential backoff
5. **Contact Privacy**: Respects individual contact preferences

## Future Enhancements

1. **Image Compression**: Reduce base64 payload size
2. **Queue System**: Handle offline scenarios with request queuing
3. **Batch Processing**: Send multiple alerts in single request
4. **Progress Indicators**: Show upload progress for large images
5. **Configuration UI**: Allow users to set API preferences

import { sendSecurityAlert } from './send_security_alert';
import { prepareImagesForAPI } from '../utils/imageUtils';
import { Contact } from '../context/SecurityProvider';

export interface SecurityAlertData {
  eventType: string;
  date: string;
  time: string;
  location: string | null;
  photoURIs: string[];
  userId: string;
  contacts: Contact[];
}

export interface APIResponse {
  success: boolean;
  message: string;
  emailsSent?: number;
}

/**
 * Send security alert to multiple contacts
 * @param data - Security event data
 * @returns Promise<APIResponse> - API response
 */
export const sendSecurityAlertToContacts = async (data: SecurityAlertData): Promise<APIResponse> => {
  try {
    console.log('[APIService] Starting to send security alerts...');
    
    // Convert images to base64
    const { image1, image2 } = await prepareImagesForAPI(data.photoURIs);
    console.log('[APIService] Images converted to base64');

    // Filter contacts that want to receive event details
    const eligibleContacts = data.contacts.filter(contact => contact.sendEventDetails);
    
    if (eligibleContacts.length === 0) {
      console.log('[APIService] No eligible contacts found for event details');
      return {
        success: true,
        message: 'No contacts configured to receive event details',
        emailsSent: 0
      };
    }

    let successCount = 0;
    let errors: string[] = [];

    // Send alerts to each eligible contact
    for (const contact of eligibleContacts) {
      try {
        // Prepare location data based on contact preferences
        const locationToSend = contact.sendLocation ? (data.location || 'Location not available') : '';
        
        // Prepare images based on contact preferences
        const imagesToSend = contact.sendPhotos ? { image1, image2 } : { image1: '', image2: '' };

        const alertPayload = {
          to: contact.email,
          eventType: data.eventType,
          date: data.date,
          time: data.time,
          mapsUrl: locationToSend,
          ...imagesToSend
        };

        console.log(`[APIService] Sending alert to ${contact.email}...`);
        const response = await sendSecurityAlert(alertPayload);
        
        if (response) {
          successCount++;
          console.log(`[APIService] Successfully sent alert to ${contact.email}`);
        }
      } catch (contactError) {
        const errorMsg = `Failed to send alert to ${contact.email}: ${contactError}`;
        console.error(`[APIService] ${errorMsg}`);
        errors.push(errorMsg);
      }
    }

    const totalContacts = eligibleContacts.length;
    
    if (successCount === totalContacts) {
      return {
        success: true,
        message: `Successfully sent alerts to all ${successCount} contacts`,
        emailsSent: successCount
      };
    } else if (successCount > 0) {
      return {
        success: true,
        message: `Sent alerts to ${successCount} of ${totalContacts} contacts. Some failed: ${errors.join(', ')}`,
        emailsSent: successCount
      };
    } else {
      return {
        success: false,
        message: `Failed to send alerts to all contacts: ${errors.join(', ')}`,
        emailsSent: 0
      };
    }
  } catch (error) {
    console.error('[APIService] Error in sendSecurityAlertToContacts:', error);
    return {
      success: false,
      message: `Failed to process security alert: ${error}`,
      emailsSent: 0
    };
  }
};

/**
 * Send a single security alert with retry logic
 * @param alertData - Alert data for single contact
 * @param retries - Number of retry attempts (default: 2)
 * @returns Promise<boolean> - Success status
 */
export const sendAlertWithRetry = async (
  alertData: any, 
  retries: number = 2
): Promise<boolean> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      console.log(`[APIService] Attempt ${attempt + 1} to send alert to ${alertData.to}`);
      const response = await sendSecurityAlert(alertData);
      
      if (response) {
        console.log(`[APIService] Successfully sent alert to ${alertData.to} on attempt ${attempt + 1}`);
        return true;
      }
    } catch (error) {
      console.error(`[APIService] Attempt ${attempt + 1} failed for ${alertData.to}:`, error);
      
      if (attempt === retries) {
        console.error(`[APIService] All ${retries + 1} attempts failed for ${alertData.to}`);
        return false;
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
      console.log(`[APIService] Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return false;
};

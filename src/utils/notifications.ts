import { Alert } from 'react-native';

export interface NotificationConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Show a native alert with appropriate styling based on type
 * @param config - Notification configuration
 */
export const showNotification = (config: NotificationConfig) => {
  const { title, message, type } = config;
  
  // You can customize the alert appearance based on type
  const alertConfig = {
    success: {
      title: `✅ ${title}`,
      buttons: [{ text: 'OK', style: 'default' as const }]
    },
    error: {
      title: `❌ ${title}`,
      buttons: [{ text: 'OK', style: 'destructive' as const }]
    },
    warning: {
      title: `⚠️ ${title}`,
      buttons: [{ text: 'OK', style: 'default' as const }]
    },
    info: {
      title: `ℹ️ ${title}`,
      buttons: [{ text: 'OK', style: 'default' as const }]
    }
  };

  const currentConfig = alertConfig[type];
  
  Alert.alert(
    currentConfig.title,
    message,
    currentConfig.buttons
  );
};

/**
 * Show success notification
 * @param title - Success title
 * @param message - Success message
 */
export const showSuccess = (title: string, message: string) => {
  showNotification({ title, message, type: 'success' });
};

/**
 * Show error notification
 * @param title - Error title
 * @param message - Error message
 */
export const showError = (title: string, message: string) => {
  showNotification({ title, message, type: 'error' });
};

/**
 * Show warning notification
 * @param title - Warning title
 * @param message - Warning message
 */
export const showWarning = (title: string, message: string) => {
  showNotification({ title, message, type: 'warning' });
};

/**
 * Show info notification
 * @param title - Info title
 * @param message - Info message
 */
export const showInfo = (title: string, message: string) => {
  showNotification({ title, message, type: 'info' });
};

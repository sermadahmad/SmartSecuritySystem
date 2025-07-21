
export  const channelConfig = {
    id: 'channelId',
    name: 'Channel name',
    description: 'Channel description',
    enableVibration: false
};


export async function startForegroundService(foregroundService: any): Promise<void> {
    const notificationConfig = {
        channelId: 'channelId',
        id: 3456,
        title: 'Foreground Service',
        text: 'Service is running',
        icon: 'ic_launcher', // This is always present
    };
    try {
        console.log('Starting foreground service...');
        console.log('Foreground service:', foregroundService);
        console.log('Notification config:', notificationConfig);
        if (!foregroundService || !foregroundService.startService) {
            console.warn('Foreground service is not available or startService is not defined');
        } else {
            await foregroundService.startService(notificationConfig);
            console.log('Foreground service started.');
        }
    } catch (e) {
        console.error('Failed to start foreground service:', e);
    }
}

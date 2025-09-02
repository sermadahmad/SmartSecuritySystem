import { ENDPOINTS } from "./endpoints";

export const sendSecurityAlert = async (data: {
    to: string;
    eventType: string;
    date: string;
    time: string;
    mapsUrl: string;
    image1: string;
    image2: string;
}) => {
    try {
        const response = await fetch(ENDPOINTS.SEND_SECURITY_ALERT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error sending security alert:', error);
        throw error;
    }
};
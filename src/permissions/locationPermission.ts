
import { Platform } from 'react-native';
import { check, request, RESULTS, Permission } from 'react-native-permissions';


export const requestPermissions = async (permissions: Permission[]): Promise<boolean> => {
  try {
    for (const perm of permissions) {
      let status = await check(perm);
      if (status === RESULTS.UNAVAILABLE) {
        continue; // Skip if not available on this device/context
      }
      if (
        status === RESULTS.BLOCKED ||
        status === RESULTS.DENIED ||
        status === RESULTS.LIMITED
      ) {
        status = await request(perm);
        if (status !== RESULTS.GRANTED) {
          return false;
        }
      } else if (status !== RESULTS.GRANTED) {
        return false;
      }
    }
    return true;
  } catch (e) {
    console.error('Permission request error:', e);
    return false;
  }
};
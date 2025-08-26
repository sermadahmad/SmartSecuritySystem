import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export const getUserId = async () => {
  let userId = await AsyncStorage.getItem("userId");
  if (!userId) {
    userId = uuid.v4();
    await AsyncStorage.setItem("userId", userId);
  }
  return userId;
};

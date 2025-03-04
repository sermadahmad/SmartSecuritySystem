import TrackPlayer, { RepeatMode } from 'react-native-track-player';

export async function setupAlarmPlayer() {
    await TrackPlayer.setupPlayer();

    await TrackPlayer.add({
        id: 'alarm',
        url: require('../assets/audios/alarm.mp3'), // Ensure you have the audio file
        title: 'Alarm Sound',
        artist: 'Security App',
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Track); // ✅ Use RepeatMode.Track
}

export async function startAlarm() {
    await TrackPlayer.play();
}

export async function stopAlarm() {
    await TrackPlayer.stop();
}

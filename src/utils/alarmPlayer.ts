import TrackPlayer, { RepeatMode } from 'react-native-track-player';

export async function setupAlarmPlayer(soundFile?: any, soundLabel?: string) {
    await TrackPlayer.reset();
    await TrackPlayer.add({
        id: 'alarm',
        url: soundFile || require('../assets/audios/alarm.mp3'),
        title: soundLabel || 'Alarm Sound',
        artist: 'Security App',
    });
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
}

export async function startAlarm() {
    await TrackPlayer.play();
}

export async function stopAlarm() {
    await TrackPlayer.stop();
}

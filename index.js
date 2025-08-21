/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import HomeScreen from './src/screensNew/HomeScreen';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./src/services/trackPlayerService'));
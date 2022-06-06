import {useState, useEffect} from 'react'
import notThumbnail from './not-thumbnail.gif'
import './App.css';

const USER_TRACK_URL = 
	'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=scriptedcrow&api_key=$API_KEY&format=json';

const TRACK_INFO_URL = 
	'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=$API_KEY&artist=$artistName&track=$trackName&format=json';


const time_ms = 5000;

const Widget = () => {
	const [track, setTrack] = useState({name: '', artist: '', cover: '' });

	const getCurrentSong = () => {
		fetch(
			USER_TRACK_URL.replace(
				'$API_KEY',
				process.env.REACT_APP_APIKEY
			),
		)
			.then(res => res.json())
			.then(data => {
				const requestedTrack = {
					name: data.recenttracks.track[0].name, 
					artist: data.recenttracks.track[0].artist['#text'],
					cover: '',
				};
				fetch(TRACK_INFO_URL.replace(
					'$API_KEY',
					process.env.REACT_APP_APIKEY,
				)
				.replace('$artistName',requestedTrack.artist)
				.replace('$trackName',requestedTrack.name),
				)
				.then(res => res.json())
				.then(data => {
					console.log(data);
					if(data.track.album && data.track.album.image[3]["#text"] !== "") {
						//console.log("Cover encontrado");
						requestedTrack.cover = data.track.album.image[3]['#text'];
					} else {
						//console.log("Cover no encontrado")
						requestedTrack.cover = notThumbnail;
					}
					setTrack(requestedTrack);
				});
			});			
	};

	useEffect(() => {
		const interval = setInterval(() => {
			getCurrentSong();
		}, time_ms);

		return () => clearInterval(interval)
	}, [track]);

	//const changeCurrentSong = () => {
	//	
	//}

  return (
    <div className="Widget">
		<img 
			className='song-cover'
			height={300} 
			src={track.cover} 
			alt={`${track.artist}`}
		/>
		<div className='song-container'>
			<img 
				className='song-BG'
				height={300} 
				src={track.cover} 
				alt={`${track.artist}`}
			/>
				<p className='title'>{track.name}</p>
				<p className='artist'>{track.artist}</p>
		</div> 
    </div>
  );
}

export default Widget;
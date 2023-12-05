import React, {useState, useEffect} from 'react'


function Songs(){
    const [song, setSong] = useState({ name: '', artist:'', albnum:''})


    return (
        <div className="song-container">
            <h1>{song.name} - {song.artist}</h1>
        </div>
    )
}

export default Songs

import React, { useState, useRef } from 'react';
import ActionButton from './ActionButton';
import './Video.css';

const YOUTUBE_VIDEOS = ["https://www.youtube.com/embed/82UsnbunJUs", "https://www.youtube.com/embed/huRFB-urWAc", "https://www.youtube.com/embed/7i1w4N29C9I", "https://www.youtube.com/embed/L0blnTRD2qU"];

function Video() {
    const [video, setVideo] = useState(YOUTUBE_VIDEOS[0]);
    const [videoArray, setVideoArray] = useState(['btn--select', '', '', ''])

    function cycleVideo (video) {
        setVideo(YOUTUBE_VIDEOS[video]);
        var newVideoArray = ['', '', '', '']
        newVideoArray[video] = 'btn--select'
        setVideoArray(newVideoArray)
    };

    return (
        <div className="video-container">
            <div className="home-wrapper">
                <h1 className="title-release">CTV3 OUT NOW</h1>
                <div className="video-player">
                    <iframe title="Music Video" width="560" height="349" src={video} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="0"></iframe>  
                </div>
                <ActionButton buttonStyle="btn--cycle" buttonSize="btn--circle" select={videoArray[0]} onClick={() => cycleVideo(0)}></ActionButton>
                <ActionButton buttonStyle="btn--cycle" buttonSize="btn--circle" select={videoArray[1]} onClick={() => cycleVideo(1)}></ActionButton>
                <ActionButton buttonStyle="btn--cycle" buttonSize="btn--circle" select={videoArray[2]} onClick={() => cycleVideo(2)}></ActionButton>
                <ActionButton buttonStyle="btn--cycle" buttonSize="btn--circle" select={videoArray[3]} onClick={() => cycleVideo(3)}></ActionButton>
            </div>
        </div>
    );
}

export default Video;

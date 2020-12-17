import React, { useState, useEffect, useRef } from 'react';
import { Button } from './Button';
import './Video.css';

const YOUTUBE_VIDEOS = ["https://www.youtube.com/embed/82UsnbunJUs", "https://www.youtube.com/embed/huRFB-urWAc", "https://www.youtube.com/embed/7i1w4N29C9I", "https://www.youtube.com/embed/L0blnTRD2qU"];

function Video() {
    const [video, setVideo] = useState(YOUTUBE_VIDEOS[0]);
    const [select, setSelect] = useState('')
    let refContainer = null

    // let refContainer = useRef();

    function cycleVideo (video) {
        setVideo(YOUTUBE_VIDEOS[video]);
        setSelect('')
        refContainer.className = "btn btn--cycle btn--circle btn--select"
        console.log(refContainer.className)
    };

    return (
        <div className="video-container">
            <div className="home-wrapper">
                <h1 className="title-release">CTV3 OUT NOW</h1>
                <div className="video-player">
                    <iframe width="560" height="349" src={video} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="0"></iframe>  
                </div>
                <Button ref={(Button) => refContainer = Button} buttonStyle="btn--cycle" buttonSize="btn--circle" buttonState={select} onClick={() => cycleVideo(0)}></Button>
                <Button ref={(Button) => refContainer = Button} buttonStyle="btn--cycle" buttonSize="btn--circle" buttonState={select} onClick={() => cycleVideo(1)}></Button>
                <Button buttonStyle="btn--cycle" buttonSize="btn--circle" onClick={() => cycleVideo(2)}></Button>
                <Button buttonStyle="btn--cycle" buttonSize="btn--circle" onClick={() => cycleVideo(3)}></Button>
            </div>
        </div>
    );
}

export default Video;

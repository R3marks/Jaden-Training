import React from 'react'
import './Video.css'

function Video() {
    return (
        <div className="video-container">
            <h1 className="title-release">CTV3 OUT NOW</h1>
            <div className="video-player">
                <iframe src="https://www.youtube.com/embed/82UsnbunJUs" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>  
            </div>
        </div>
    )
}

export default Video

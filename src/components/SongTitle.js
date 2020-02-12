import React from "react";

const SongTitle = props => {

    // TODO - format this with album art on the side
    return (
        <p>{props.song.item.name} by {props.song.item.artists[0].name}</p>
    )
};

export default SongTitle;
function durationToText(duration) {
    let time = duration % 1000 + "ms";
    if ((duration = Math.floor(duration / 1000)) > 0)
        time = duration % 60 + "s " + time;
    if ((duration = Math.floor(duration / 60)) > 0)
        time = duration % 60 + "m " + time;
    if ((duration = Math.floor(duration / 60)) > 0)
        time = duration % 24 + "h " + time;
    if ((duration = Math.floor(duration / 24)) > 0)
        time = duration + "days " + time;
    return time;
}

export default durationToText;
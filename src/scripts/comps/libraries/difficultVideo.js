'use strict'
let videos = document.querySelectorAll('.difficult-video');
if (videos.length > 0) {
    let videoUploadedWidth = [];
    let videoPointLeft = [];
    let videoUploadedActive = [];
    videos.forEach(function(video, index) {
        let videoPlays = joinNodeList(video.querySelectorAll('.difficult-video__play'), video.querySelectorAll('.difficult-video__big-play'));
        let videoTrack = video.querySelector('video');
        let videoMove = video.querySelector('.difficult-video__track');
        let videoTrackScanned = video.querySelector('.difficult-video__track-scanned');
        let videoTrackUploaded = video.querySelector('.difficult-video__track-uploaded');
        let videoTrackPoint = video.querySelector('.difficult-video__track-point');
        videoUploadedActive[`$[index]`] = true;
        videoPlays.forEach(function (videoPlay) {
            videoPlay.addEventListener('click', function(e) {
                if (video.classList.contains('_pause')) {
                    videoTrack.play()
                    video.classList.remove('_pause');
                    video.classList.add('_play');
                    videoPlays.forEach(function(vp) {
                        vp.innerHTML = vp.classList.contains('difficult-video__big-play') ? '<ion-icon name="pause-circle-outline"></ion-icon>' : '<ion-icon name="pause"></ion-icon>';
                    })    
                } else {
                    videoTrack.pause()
                    video.classList.remove('_play');
                    video.classList.add('_pause');    
                    videoPlays.forEach(function(vp) {
                        vp.innerHTML = vp.classList.contains('difficult-video__big-play') ? '<ion-icon name="play-circle-outline"></ion-icon>' : '<ion-icon name="play"></ion-icon>';   
                    })
                }
            })
        })
        videoTrack.addEventListener('timeupdate', function(e) {
            videoTrackScanned.style.width = `${videoTrack.currentTime / videoTrack.duration * 100}%`;
            videoPointLeft[`$[index]`] = `${videoTrackScanned.getBoundingClientRect().right - videoTrackScanned.getBoundingClientRect().left - 1}px`;
            videoUploadedWidth[`$[index]`] = `${videoTrack.buffered.end(videoTrack.buffered.length - 1) / videoTrack.duration * 100}%`;
            if (videoUploadedActive[`$[index]`]) {
                videoTrackUploaded.style.width = videoUploadedWidth[`$[index]`];
                videoTrackPoint.style.left = videoPointLeft[`$[index]`];
            }
        })
        videoMove.addEventListener('mousedown', function(e) {
            videoUploadedActive[`$[index]`] = false;
            console.log('a')
            video.classList.add('_video-move');
        })
        window.addEventListener('mousemove', function(e) {
            if (!videoUploadedActive[`$[index]`]) {
                let videoTrackUploaded = video.querySelector('.difficult-video__track-uploaded');
                videoTrackUploaded.style.width = `${e.clientX - videoMove.getBoundingClientRect().left}px`;
                console.log(e.clientX, videoMove.getBoundingClientRect().left);
                videoTrackPoint.style.left = `${videoTrackUploaded.getBoundingClientRect().right - videoTrackUploaded.getBoundingClientRect().left - 1}px`;
            }
        })
        window.addEventListener('mouseup', function(e) {
            videoUploadedActive[`$[index]`] = true;
            videoTrackUploaded.style.width = videoUploadedWidth[`$[index]`];
            video.classList.remove('_video-move')
            console.log('c')
        })
    })

}
function joinNodeList(obj1, obj2) {
    let result = [];
    obj1.forEach(function (ind) {
        result.push(ind)
    })
    obj2.forEach(function (ind) {
        result.push(ind)
    })
    return result
}
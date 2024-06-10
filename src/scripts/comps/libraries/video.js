'use strict'
let videos = document.querySelectorAll('.video');
if (videos.length > 0) {
    videos.forEach(function(video, index) {
        let videoControl = video.querySelector('.video__control');
        let videoTrack = video.querySelector('video');
        videoControl.addEventListener('click', function(e) {
            if (video.classList.contains('_pause')) {
                videoTrack.play()
                video.classList.remove('_pause');
                video.classList.add('_play');
                videoControl.innerHTML = '<ion-icon name="pause-circle-outline"></ion-icon>';
                
            } else {
                videoTrack.pause()
                video.classList.remove('_play');
                video.classList.add('_pause');    
                videoControl.innerHTML = '<ion-icon name="play-circle-outline"></ion-icon>';      
            }
        })
    })
}

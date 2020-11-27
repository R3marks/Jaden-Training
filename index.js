if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    var buyTicketsButtons = document.getElementsByClassName('button-buy-tickets')
    for (var i = 0; i < buyTicketsButtons.length; i++) {
        var button = buyTicketsButtons[i]
        button.addEventListener('click', thanksForBuying)
    }

    var getMyLatestAlbumButton = document.getElementsByClassName('button-get-album')[0]
    if (getMyLatestAlbumButton) {
        getMyLatestAlbumButton.addEventListener('click', sendToStore) 
    }

    var playMusicButton = document.getElementsByClassName('button-play')[0]
    if (playMusicButton) {
        playMusicButton.addEventListener('click', playMusic)
    }
}

function sendToStore() {
    location.href = 'store.html'
}

function playMusic() {
    alert('### I am just an Icon living ###')
}

function thanksForBuying() {
    alert('Thanks for purchasing tickets to come and see me!')
}
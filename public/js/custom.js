$(function() {
    var socket = io();

    $('#sendTweet').submit(function() {
        var content = $('#tweet').val();
        socket.emit('tweet', { content: content });
        $('#tweet').val('');
        return false;
    });
});
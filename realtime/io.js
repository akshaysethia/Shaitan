module.export = function(io) {
    io.on('connection', function(socket) {
        console.log("Connected");
        console.log(req.user);
    });
}
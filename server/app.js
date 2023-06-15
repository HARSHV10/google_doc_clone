const io = require('socket.io')(3000,{
    cors:{
        origin:['http://localhost:5173']
    }
});



//// using the event listner to make the event 
io.on('connection',socket=>{
    /// ab basically mai event call kar sakta hu 
    console.log("the server is connected ")
    // socket.on('changeing',(str)=>{
    //     console.log("hello from the server ")
    // })

    // making the room for editing the document 
    socket.on('join-room',(room)=>{
        //  join the use in the room 
        console.log(room)
        socket.join(room);
        socket.to(room).emit("enter-room",`${socket.id} joined ${room}`)

     })

     socket.on('send-changes',(room,delta)=>{
        if(room==null){
           console.log("join a room")
        }
        else{

            console.log(delta)
            socket.to(room).emit('receive-changes',delta)
        }
     })

})
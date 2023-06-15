import React, { useCallback, useEffect,useState, useRef } from 'react';
import Quill from "quill"
import "quill/dist/quill.snow.css"
import './style.css'
import {io} from "socket.io-client"

 
export default function Main(){ 
  const socket = io('http://localhost:3000');
  
  
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////
  /// making the event from the server                         ///
useEffect(()=>{
  socket.on('connect',()=>{
    console.log(`hello ${socket.id}`)
  })
  
},[])
  



  const Toolbar_options=[
    [{header:[1,2,3,4,5,6,false]}],
    [{font:[]}],
    [{list:"ordered"},{list:"bullet"}],
    ["bold","italic","underline"],
    [{color:[]},{background:[]}],
    [{script:"sub"},{script:"super"}],
    [{align:[]}],
    ["iamge","blockquote","code-block"],
    ["clean"],
  ]
 
const [quill,setQuill]=useState();
const [room ,setRoom]=useState();



  /// here we are basically setting up the quill 
const wrapperRef=useCallback((wrapper)=>{
  if(wrapper==null) return
  wrapper.innerHTML='';
  const editor =document.createElement('div')
  wrapper.append(editor);
  const q=new Quill(editor,{theme:"snow"});
  setQuill(q);
  
},[])


useEffect(() => {
  if(socket ==null || quill == null){ return} ;
  const handler = (delta,oldDelta,source)=>{
    if(source!=='user') return ;
    socket.emit("send-changes",room,delta);
  }
  quill.on('text-change',handler);
  return ()=>{
    quill.off('text-change',handler);
  }
}, [socket,quill])



useEffect(() => {
  if(socket ==null || quill == null)return;
  const handler = (delta)=>{
    quill.updateContents(delta)
  }
  socket.on('receive-changes',handler);
  
  return ()=>{
    socket.off('receive-changes',handler);
  }
}, [socket,quill])







  return(
    <div>
    <input onChange={(e)=>{
      // console.log(e.target.value)
      setRoom(e.target.value);
      console.log(room);
    }}></input>
    <button onClick={()=>{
      if(room==null){
        alert("room is null");
      }
      else{
      socket.emit('join-room',room,()=>{
        console.log("hello")
      })
      }
      // socket.emit('join-room',room,()=>{
      //   console.log("hello")
      // })
    }}>Join </button> 

   <button onClick={()=>{
    console.log("hello")
    socket.emit('changeing',"hello")
   }}>Submit</button>
    <div className='container' ref={wrapperRef}>
    </div>
    </div>
  )
}
import React, {useState, useEffect, useCallback} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../providers/Socket'

const HomePage =()=>{
    const [email, setEmail] =useState()
    const [roomId, setRoomId] =useState()
    const { socket } =useSocket()
    const navigate= useNavigate()
    
    const handleJoinRoom= ()=>{
        socket.emit('join-room', {emailId: email, roomId})
    }

    const handleRoomJoin = useCallback(({roomId}) =>{
        console.log('room joined', roomId);
        navigate(`/room/${roomId}`)
    },[navigate])

    useEffect(()=>{
        socket.on('joined_room',handleRoomJoin)
        return ()=>{
            socket.off('joined_room',handleRoomJoin)
        }
    },[handleRoomJoin,socket])

    return(
        <div>
            <input type='email' onChange={e=>setEmail(e.target.value)} placeholder='Enter your mail'/>
            <input type='text' onChange={e=>setRoomId(e.target.value)} placeholder='Enter code'/>
            <button onClick={handleJoinRoom}>Code</button>
        </div>
    )
}

export default HomePage
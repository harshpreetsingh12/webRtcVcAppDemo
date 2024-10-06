import React, {useState, useEffect, useCallback} from 'react'
import ReactPlayer from 'react-player'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'
const RoomPage =()=>{
    const { socket } = useSocket()
    const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer()
    const [myStream, setMyStream] = useState(null)
    const [remoteEmailId, setRemoteEmailId] = useState(null)
    
    const handleNewUserJoined = useCallback(async (data)=>{
        const {emailId} = data
        console.log('new user ',emailId)
        const offer = await createOffer()
        socket.emit('call-user', {emailId , offer});
        setRemoteEmailId(emailId)
    },[createOffer, socket]);

    const handleIncomingCall = useCallback(async (data)=>{
        const {from, offer} =data
        console.log('incoming from', from ,offer)
        const ans= await createAnswer(offer)
        socket.emit('call-accepted', { emailId: from, ans })
        setRemoteEmailId(from)
    },[createAnswer, socket]);

    const handleCallAccept = useCallback(async (data)=>{
        const { ans } = data
        console.log('call got accepted',ans)
        await setRemoteAnswer()
    },[setRemoteAnswer]);

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on('incoming-call',handleIncomingCall)
        socket.on('call-accepted',handleCallAccept)

        return () =>{
            socket.off('user-joined',handleNewUserJoined)
            socket.off('incoming-call',handleIncomingCall)
            socket.off('call-accepted',handleCallAccept)
        }
    },[handleCallAccept, handleIncomingCall, handleNewUserJoined, socket])
    
    const getUserMediaStream = useCallback(async()=>{
        const stream= await navigator.mediaDevices.getUserMedia({ audio: true, video: true});
        setMyStream(stream)
    })
    const handleNegotiation = useCallback(() =>{
        const localOffer = peer.localDescription;
        socket.emit('call-user', {emailId:remoteEmailId, offer:localOffer})
    })

    useEffect(()=>{
        peer.addEventListener('negotiationneeded',handleNegotiation)
        return () =>{
          peer.removeEventListener('negotiationneeded',handleNegotiation)
        }
      },[peer])
    useEffect(()=>{
        getUserMediaStream()
    },[getUserMediaStream])
console.log(remoteStream)

    return(
        <div>
           Room
           <h4>you are connected to {remoteEmailId}</h4>
           <button onClick={(e)=>sendStream(myStream)}>send my videp</button>
           <ReactPlayer url={myStream} playing muted/>
           <ReactPlayer url={remoteStream} playing muted/>
        </div>
    )
}

export default RoomPage
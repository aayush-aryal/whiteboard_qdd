import { Stage, Layer, Line } from 'react-konva';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';

const Board = ({user, setUser}) => {
    const [lines,setLines]=useState([])
    const [isDrawing,setIsDrawing]=useState(false)
    const [isEraser, setIsEraser]=useState(false);
    const navigate=useNavigate();
    const [roomId, setRoomId] = useState(null);
    const [userRoomInput, setUserRoomInput] = useState('');    
    const socket=useSocket();

    useEffect(() => {
      if (!roomId) {
        setRoomId(uuidv4());
      }
    }, []);
// join a room when room Id changes
    useEffect(()=>{
      if (socket && roomId){
        // emit join room to server 
          socket.emit('joinRoom', roomId) 
        }      
    }, [roomId])

    // key idea: upon changes in board i need to emit changes
    //useeffect for this logic seems right


    useEffect(() => {
      if (!socket) return;
    
      socket.on('boardUpdate', (data) => {
        console.log('received update for room', roomId, data);
        setLines([...data]);
      });

      socket.on('request-board',({userId})=>{
        console.log("sending new data to ", userId)
        console.log("this is the board im sending", lines)
       // on board request to other clients
       socket.emit('update-user-board',{data:lines, userId, roomId:roomId})
      } )
    
      socket.on('new-board-to-user', ({data})=>{
        console.log("received this new board", data)
        console.log("current board is ", lines)
        setLines([...data]);
      })
      return () => {
        socket.off('boardUpdate');
        socket.off('request-board');
        socket.off('new-board-to-user');
      };
    }, [socket, roomId,lines]);

    
    const handleMouseDown = (e) => {
      if (isEraser) return;
      setIsDrawing(true);
      const pos = e.target.getStage().getPointerPosition();
      setLines((prev) => [...prev, { points: [pos.x, pos.y] }]);
    };

    const handleJoinRoom=(e)=>{
      e.preventDefault();
      if (userRoomInput.trim()) setRoomId(userRoomInput)
    }
    const handleMouseMoving=(e)=>{
      if (!isDrawing || isEraser ) return;
      //stage similar to dom component in konva
      const stage=e.target.getStage();
      const point=stage.getPointerPosition();
      //connect prev line to this line
      const updatedLines=[...lines]
      const lastLine={...updatedLines[updatedLines.length-1]}
      lastLine.points=[...lastLine.points, point.x,point.y]
      updatedLines[updatedLines.length-1]=lastLine
      setLines([...updatedLines])
      socket.emit('boardUpdate', {data:updatedLines,roomId: roomId})
     
  }
    

    const handleMouseUp=()=>{
        setIsDrawing(false)
       
        
    }

    const handleLineClick=(index)=>{
        if (!isEraser) return;
        const updatedLines=lines.filter((_,i)=>i!==index);
        setLines(updatedLines)
        if (socket) {
          socket.emit('boardUpdate', { data: updatedLines, roomId:roomId });
        }
    }

    const handleSubmit=async (e)=>{
      e.preventDefault();
      await axios.post("http://localhost:3000/auth/logout", {}, { withCredentials: true });
      setUser(null)
      navigate("/")
    }
    return (
        <>
        <h3>Welcome, {user?.username || "Guest"}!</h3>
        <p>Your current Board Id is: {roomId}</p>
        <button type="submit" onClick={handleSubmit}>Logout</button>
          <button onClick={() => setIsEraser(!isEraser)}>
            {isEraser ? 'Switch to Draw' : 'Switch to Eraser'}
          </button>
        
          <input type="text" placeholder='RoomID' value={userRoomInput} name='roomId' onChange={(e)=>setUserRoomInput(e.target.value)}/>
          <button onClick={handleJoinRoom}>Join Room</button>


    
          <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMoving}
            onMouseUp={handleMouseUp}
            style={{
                cursor: isEraser
                  ? 'url(ee.svg) 16 16, auto' // Custom eraser cursor
                  : 'crosshair', // Default cursor for drawing
              }}
          >
            <Layer>
              {lines.map((line, idx) => (
                <Line
                  key={idx}
                  points={line.points}
                  stroke="black"
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  onClick={() => handleLineClick(idx)}
                />
              ))}
            </Layer>
          </Stage>
        </>
      );
    };
    

export default Board;

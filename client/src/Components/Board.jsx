import { Stage, Layer, Line } from 'react-konva';
import {useEffect, useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';
import "../index.css"

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
        setLines([...data]);
      });

      socket.on('request-board',({userId})=>{
       // on board request to other clients
       socket.emit('update-user-board',{data:lines, userId, roomId:roomId})
      } )
    
      socket.on('new-board-to-user', ({data})=>{
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

    const handleMouseMoving = (e) => {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
    
      // Safety check
      if (!point?.x || !point?.y) return;
    
      if (isEraser) {
        const tolerance = 10; // Adjust this for eraser sensitivity
    
        const isNear = (x1, y1, x2, y2, radius) => {
          const dx = x1 - x2;
          const dy = y1 - y2;
          return dx * dx + dy * dy <= radius * radius;
        };
    
        const updateErased = lines.filter((line) => {
          const pts = line.points;
          for (let i = 0; i < pts.length; i += 2) {
            const x = pts[i];
            const y = pts[i + 1];
            if (isNear(point.x, point.y, x, y, tolerance)) {
              return false; // Erase this line
            }
          }
          return true; // Keep this line
        });
    
        setLines(updateErased);
        socket.emit('boardUpdate', { data: updateErased, roomId });
        return;
      }
    
      if (!isDrawing) return;
    
      const updatedLines = [...lines];
      const lastLine = { ...updatedLines[updatedLines.length - 1] };
      lastLine.points = [...lastLine.points, point.x, point.y];
      updatedLines[updatedLines.length - 1] = lastLine;
      setLines(updatedLines);
      socket.emit('boardUpdate', { data: updatedLines, roomId });
    };
    
    

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
      const res=await axios.post("http://localhost:3000/auth/logout", user,{ withCredentials: true });
      if (res.data.message == "Logged out sucessfully"){
        setUser(null)
        navigate("/")
      }
      console.log('hait')

    }
    return (
      <div className="p-4 space-y-4 bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Welcome, {user?.username || "Guest"}!</h3>
            <p className="text-sm text-gray-600">Board ID: <span className="font-mono text-blue-600">{roomId}</span></p>
          </div>
    
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
            <button
              onClick={() => setIsEraser(!isEraser)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:blue-600"
            >
              {isEraser ? 'Switch to Draw' : 'Switch to Eraser'}
            </button>
            <input
              type="text"
              placeholder="Enter Room ID"
              className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userRoomInput}
              onChange={(e) => setUserRoomInput(e.target.value)}
            />
            <button
              onClick={handleJoinRoom}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Join Room
            </button>
          </div>
        </div>
    
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 150}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoving}
          onMouseUp={handleMouseUp}
          style={{
            cursor: isEraser
              ? 'url(er.png)16 16, pointer'
              : 'url(content.png) 8 15, pointer',
            border: "2px solid #ddd",
            borderRadius: "1rem",
            marginTop: "1rem"
          }}
        >
          <Layer>
            {lines.map((line, idx) => (
              <Line
                key={idx}
                points={line.points}
                stroke="#333"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
                globalCompositeOperation="source-over"
                onClick={() => handleLineClick(idx)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    );
    
    };
    

export default Board;

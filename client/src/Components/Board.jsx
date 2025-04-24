import { Stage, Layer, Line } from 'react-konva';
import {useState} from 'react';

const Board = () => {
    const [lines,setLines]=useState([])
    const [isDrawing,setIsDrawing]=useState(false)
    const [isEraser, setIsEraser]=useState(false);

    const handleMouseDown=(e)=>{
        if (isEraser) return;
        setIsDrawing(true)
        const stage = e.target.getStage();
        const pos = stage.getPointerPosition();
        setLines([...lines, { points: [pos.x, pos.y] }]);

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
        console.log(lastLine)
        setLines([...updatedLines])
    }

    const handleMouseUp=()=>{
        setIsDrawing(false)
    }

    const handleLineClick=(index)=>{
        if (!isEraser) return;
        const updatedLines=lines.filter((_,i)=>i!==index);
        setLines(updatedLines)
    }
    return (
        <>
          <button onClick={() => setIsEraser(!isEraser)}>
            {isEraser ? 'Switch to Draw' : 'Switch to Eraser'}
          </button>
    
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

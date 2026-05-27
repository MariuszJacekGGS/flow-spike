import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { NodeAdder } from "../tools/NodeAdder";


export function TextUpdaterNode({ id, data, positionX, positionY }){
    
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback((field, value) => {
        setNodes((nds) => 
        nds.map((node) => {
            if (node.id === id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        [field]: value,
                    },
                };
            }
            return node;
        })
        );
    }, [id, setNodes]);

    return (
        <div className="custom-flow-node" style={{ position: 'relative'}}>
            <div className="input-group">
                <label htmlFor="text" className="node-label">Text</label>
                <input 
                    type="text" 
                    id="text" 
                    onChange={(e) => updateNodeData('text', e.target.value)} 
                    className="nodrag node-input" 
                    placeholder="Wpisz tekst..."
                />
            </div>
            <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
            <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
        
            <NodeAdder parentNodeId={id} />
        </div>
    );

}
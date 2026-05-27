import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { NodeAdder } from "../tools/NodeAdder";

export function SelectListUpdate({ id, data, positionX, positionY }) {

    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback((field, value) => {
        setNodes((nds) => 
            nds.map((node) => {
                if (node.id === id){
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            [field]: value,
                        },
                    };
                }
                return node;
            }));
    }, [id, setNodes]);

    return (
        <div className="custom-flow-node" style={{ position: 'relative' }}>
            <div className="input-group">
                <label className="node-label">Kategoria obiektu:</label>
                <div className="select-wrapper">
                    <select value={data.category || 'Polygon'} onChange={(e) => updateNodeData('category', e.target.value)} className="nodrag node-select">
                        <option value="Rectangle">Regtangle</option>
                        <option value="Circle">Circle</option>
                        <option value="Polygon">Polygon</option>
                    </select>
                </div>
            </div>
            <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
            <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
        
            <NodeAdder parentNodeId={id} />
        </div>
    );
}
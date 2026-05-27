import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { NodeAdder } from "../tools/NodeAdder";

export function RangeNode({ id, data, positionX, positionY }) {

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
        <div className="custom-flow-node">
            <div className="input-group">
                <div className="range-label-container">
                    <label className="node-label">Wybór z zakresu</label>
                    <span className="range-value">{data.rangeValue ?? 50}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={data.rangeValue ?? 50}
                    onChange={(e) => updateNodeData('rangeValue', parseInt(e.target.value))}
                    className="nodrag node-range"
                />
            </div>
            <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
            <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
        
            <NodeAdder parentNodeId={id} />
        </div>
    )
}
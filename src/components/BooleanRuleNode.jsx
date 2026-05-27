import { Handle, Position, useReactFlow } from "@xyflow/react";

export function BooleanRuleNode({ id, data }) {
  const { setNodes } = useReactFlow();

  return (
    <div className="custom-flow-node rule-boolean">
      <div className="node-header">Rule: BOOLEAN (Yes/No)</div>
      <div className="input-group">
        <label className="node-label">Logic Variable</label>
        <input 
          type="text" 
          className="node-input nodrag" 
          value={data.variableName || ""} 
          onChange={(e) => setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, variableName: e.target.value } } : n))}
          placeholder="np. CZY_DARMOWA_DOSTAWA"
        />
      </div>
      <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
      <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
    </div>
  );
}
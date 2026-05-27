import { Handle, Position, useReactFlow } from "@xyflow/react";

export function AnyValueRuleNode({ id, data }) {
  const { setNodes } = useReactFlow();

  return (
    <div className="custom-flow-node rule-any">
      <div className="node-header">Rule: ANY_VALUE (Exists)</div>
      <div className="input-group">
        <label className="node-label">Ckecked variable</label>
        <input 
          type="text" 
          className="node-input nodrag" 
          value={data.variableName || ""} 
          onChange={(e) => setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, variableName: e.target.value } } : n))}
          placeholder="ex. ADDITIONAL_INFORMATIONS"
        />
      </div>
      <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
      <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
    </div>
  );
}
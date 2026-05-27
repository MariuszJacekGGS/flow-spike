import { Handle, Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";

export function SelectRuleNode({ id, data }) {
  const { setNodes } = useReactFlow();
  const [inputVal, setInputVal] = useState("");
  const options = data.options || [];

  const addOption = () => {
    if (!inputVal.trim() || options.includes(inputVal.trim())) return;
    const updated = [...options, inputVal.trim()];
    
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, options: updated } } : n));
    setInputVal("");
  };

  const updateName = (name) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, variableName: name } } : n));
  };

  return (
    <div className="custom-flow-node rule-select">
      <div className="node-header">Rule: SELECT (Enum)</div>
      <div className="input-group">
        <label className="node-label">Feature name</label>
        <input 
          type="text" 
          className="node-input nodrag" 
          value={data.variableName || ""} 
          onChange={(e) => updateName(e.target.value)}
          placeholder="ex. PRODUCT_COLOR"
        />
        
        <label className="node-label" style={{marginTop: '8px'}}>Options to choose</label>
        <div className="enum-tags-container">
          {options.map((opt, i) => <span key={i} className="enum-tag">{opt}</span>)}
        </div>
        
        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }} className="nodrag">
          <input 
            type="text" 
            className="node-input" 
            value={inputVal} 
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Add options..."
          />
          <button onClick={addOption} className="node-mini-btn">+</button>
        </div>
      </div>
      <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
      <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
    </div>
  );
}
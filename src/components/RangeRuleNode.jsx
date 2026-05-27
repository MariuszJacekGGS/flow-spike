import { Handle, Position, useReactFlow } from "@xyflow/react";

export function RangeRuleNode({ id, data }) {
  const { setNodes } = useReactFlow();

  const updateRangeMax = (val) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, rangeMax: parseInt(val) || 0 } } : n));
  };

  return (
    <div className="custom-flow-node rule-range">
      <div className="node-header">Rule: RANGE (Liczba)</div>
      <div className="input-group">
        <label className="node-label">Zmienna liczbowa</label>
        <input 
          type="text" 
          className="node-input nodrag" 
          value={data.variableName || ""} 
          onChange={(e) => setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, variableName: e.target.value } } : n))}
          placeholder="np. ILOSC_SZTUK"
        />
        <label className="node-label" style={{marginTop: '8px'}}>Granica maksymalna</label>
        <input 
          type="number" 
          className="node-input nodrag" 
          value={data.rangeMax || 0} 
          onChange={(e) => updateRangeMax(e.target.value)}
        />
      </div>
      <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
      <Handle type="source" position={Position.Bottom} id="source-handle" className="custom-handle" />
    </div>
  );
}
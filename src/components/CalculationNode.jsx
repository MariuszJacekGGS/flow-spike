import { Handle, Position, useReactFlow } from "@xyflow/react";

export function CalculationNode({ id, data }) {
  const { setNodes } = useReactFlow();

  const updateField = (field, value) => {
    setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, [field]: value } } : n));
  };

  return (
    <div className="custom-flow-node rule-calculation">
      <div className="node-header">Result: CALCULATION</div>
      <div className="input-group">
        
        <label className="node-label">Type of result</label>
        <select 
          className="node-input nodrag"
          value={data.calculationTypeCode || "MATH_FORMULA"}
          onChange={(e) => updateField('calculationTypeCode', e.target.value)}
        >
          <option value="MATH_FORMULA">Math formula</option>
          <option value="STATIC_VALUE">Static value</option>
          <option value="DB_ORD_COL">Database column</option>
        </select>

        <label className="node-label" style={{marginTop: '8px'}}>Type of output data</label>
        <select 
          className="node-input nodrag"
          value={data.returnMetricType || "NUMBER"}
          onChange={(e) => updateField('returnMetricType', e.target.value)}
        >
          <option value="NUMBER">Number</option>
          <option value="TEXT">Text</option>
          <option value="BOOLEAN">Boolean</option>
        </select>

        <label className="node-label" style={{marginTop: '8px'}}>Equation / Value</label>
        <input 
          type="text" 
          className="node-input nodrag" 
          value={data.expression || ""} 
          onChange={(e) => updateField('expression', e.target.value)}
          placeholder={data.calculationTypeCode === 'MATH_FORMULA' ? "np. X * 0.85" : "np. Bezpłatna"}
        />
      </div>
      
      <Handle type="target" position={Position.Top} id="target-handle" className="custom-handle" />
    </div>
  );
}
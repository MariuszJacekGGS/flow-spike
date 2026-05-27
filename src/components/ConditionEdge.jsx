import { BaseEdge, EdgeLabelRenderer, getEdgeCenter, useReactFlow } from '@xyflow/react';
import { CONDITION_TYPES_MAP } from '../constants/calculations';

export function ConditionEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
  data
}) {
  const { getEngine, setEdges, getNode, getEdges } = useReactFlow();


  const [edgeX, edgeY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const sourceNode = getNode(source);
  const sourceType = sourceNode ? sourceNode.type : null; 
  const allConditions = CONDITION_TYPES_MAP[sourceType] || [];

  const siblingsEdges = getEdges().filter(edge => edge.source === source && edge.id !== id);

  const usedConditionCodes = siblingsEdges.map(edge => edge.data?.conditionValueTypeCode);

  const availableConditions = allConditions.filter(cond => {
    if(['BOOLEAN', 'ANY_VALUE'].includes(sourceType)) {
        return !usedConditionCodes.includes(cond.code) || data?.conditionValueTypeCode === cond.code;
    }

    return true;
  })

  const updateEdgeData = (field, value) => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === id) {
          const updatedData = { ...edge.data, [field]: value };
          
          let newLabel = value;
          if (field === 'conditionValueTypeCode') {
            const found = allConditions.find(c => c.code === value);
            newLabel = found ? found.name : value;
          }

          return {
            ...edge,
            label: field === 'value' ? `[${edge.data?.conditionValueTypeCode || ''}] = ${value}` : newLabel,
            data: updatedData,
          };
        }
        return edge;
      })
    );
  };


  const pathString = `M ${sourceX} ${sourceY} Q ${(sourceX + targetX) / 2} ${(sourceY + targetY) / 2} ${targetX} ${targetY}`;

  return (
    <>
      <path id={id} style={style} className="react-flow__edge-path" d={pathString} markerEnd={markerEnd} />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${edgeX}px,${edgeY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan edge-condition-container"
        >
          <select
            value={data?.conditionValueTypeCode || ''}
            onChange={(e) => updateEdgeData('conditionValueTypeCode', e.target.value)}
            className="edge-select"
          >
            <option value="">-- Choose a condition --</option>
            {availableConditions.map((cond) => (
              <option key={cond.code} value={cond.code}>
                {cond.name}
              </option>
            ))}
          </select>
          {['LIST_OPTION', 'RANGE_SPLIT', 'RANGE_MAX'].includes(data?.conditionValueTypeCode) && (
            <input
              type="text"
              placeholder="Value..."
              value={data?.value || ''}
              onChange={(e) => updateEdgeData('value', e.target.value)}
              className="edge-input"
            />
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
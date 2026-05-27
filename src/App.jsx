import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


import { RangeRuleNode } from './components/RangeRuleNode';
import { SelectRuleNode } from './components/SelectRuleNode';
import { BooleanRuleNode } from './components/BooleanRuleNode';
import { AnyValueRuleNode } from './components/AnyValueRuleNode';

import { ConditionEdge } from './components/ConditionEdge';
import { RULE_METRIC_MAP } from './constants/calculations';

import { CalculationNode } from './components/CalculationNode';

import './App.css';

const initialNodes = [
  { 
    id: 'rule_start', 
    type: 'SELECT',
    position: { x: 250, y: 50 }, 
    data: { 
      variableName: 'PRODUCT_COLOR', 
      options: ['WHITE', 'BLACK'] 
    } 
  }
];

const initialEdges = [];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const nodeTypes = {
    RANGE: RangeRuleNode,
    SELECT: SelectRuleNode,
    BOOLEAN: BooleanRuleNode,
    ANY_VALUE: AnyValueRuleNode,
    CALCULATION: CalculationNode,
  };

  const edgeTypes = {
    step: ConditionEdge,
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: 'step', animated: true }, eds)),
    []
  );

  const addNewRule = (ruleType) => {
    const uniqueId = `rule_${Date.now()}`;
    const newNode = {
      id: uniqueId,
      type: ruleType,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { 
        variableName: `NOWA_ZMIENNA_${nodes.length}`,
        options: ruleType === 'SELECT' ? [] : null
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setIsDropdownOpen(false);
  };

  const generateCalculationTree = () => {
    const allRules = nodes.filter(n => n.type !== 'CALCULATION');
    const allCalculations = nodes.filter(n => n.type === 'CALCULATION');

    const buildPathForCalculation = (calcNodeId) => {
      let currentTargetId = calcNodeId;
      let pathSteps = [];
      let safetyCounter = 0;

      while (currentTargetId && safetyCounter < 100){
        
        safetyCounter++;

        const incomingEdge = edges.find(edge => edge.target === currentTargetId);

        if (!incomingEdge){
            break;
        }

        const parentNode = nodes.find(node => node.id === incomingEdge.source);

  if (parentNode) {
          const varName = parentNode.data.variableName || 'NIEZNANA_ZMIENNA';
          const condType = incomingEdge.data?.conditionValueTypeCode || 'NOT_SET';
          const condVal = incomingEdge.data?.value || '';

          let stepDescription = '';
          if (condType === 'BOOL_TRUE') stepDescription = `${varName} == TRUE`;
          else if (condType === 'BOOL_FALSE') stepDescription = `${varName} == FALSW`;
          else if (condType === 'LIST_OPTION') stepDescription = `${varName} == "${condVal}"`;
          else if (condType === 'LIST_OTHER') stepDescription = `${varName} == OTHER_VALUE`;
          else if (condType === 'RANGE_SPLIT') stepDescription = `${varName} < ${condVal}`;
          else if (condType === 'RANGE_MAX') stepDescription = `${varName} <= ${condVal} (MAX)`;
          else if (condType === 'ANY_VALUE') stepDescription = `${varName} HAS_ANY_VALUE`;
          else if (condType === 'NO_VALUE') stepDescription = `${varName} IS_NULL`;
          else stepDescription = `${varName} [${condType}] ${condVal}`;

          pathSteps.unshift(stepDescription);
        }

        currentTargetId = incomingEdge.source;
      }

      return pathSteps.length > 0 ? pathSteps.join(' -> ') : 'Node zombie';
    };

    const treePayload = {
      updatedAt: new Date().toISOString(),
      // rules: nodes.map(node => ({
      //   id: node.id,
      //   conditionTypeCode: node.type,
      //   metricTypeCode: RULE_METRIC_MAP[node.type] || 'TEXT',
      //   variableName: node.data.variableName || 'UNNAMED',
      //   meta: {
      //     options: node.data.options || null,
      //     rangeMax: node.data.rangeMax || null,
      //   }
      // })),
      // conditions: edges.map(edge => ({
      //   id: edge.id,
      //   fromRuleId: edge.source,
      //   toRuleId: edge.target,
      //   conditionValueTypeCode: edge.data?.conditionValueTypeCode || 'NOT_SET',
      //   value: edge.data?.value || (edge.data?.conditionValueTypeCode === 'BOOL_TRUE' ? 'true' : edge.data?.conditionValueTypeCode === 'BOOL_FALSE' ? 'false' : null) || null
      // })),

      rules: allRules.map(node => ({
        id: node.id,
        conditionTypeCode: node.type,
        metricTypeCode: RULE_METRIC_MAP[node.type] || 'TEXT',
        variableName: node.data.variableName || 'NO_SET',
        meta: {
          options: node.data.options || null,
          rangeMax: node.data.rangeMax || null,
        }
      })),

      conditions: edges.map(edge => ({
        id: edge.id,
        fromRuleId: edge.source,
        toRuleId: edge.target,
        conditionValueTypeCode: edge.data?.conditionValueTypeCode || 'NOT_SET',
        value: edge.data?.value || null
      })),

      calculations: allCalculations.map(node => {
        const generatedPath = buildPathForCalculation(node.id);
        const expression = node.data.expression || '0';

        return {
          id: node.id,
          calculationTypeCode: node.data.calculationTypeCode || 'MATH_FORMULA',
          returnMetricType: node.data.returnMetricType || 'NUMBER',
          expression: expression,

          humanRedablePath: generatedPath,
          finalFormulaSummary: `IF (${generatedPath}) THEN USE: [${expression}]`
        };
      })

    };

    console.log("=== GENERATOED STRUCTURE OF CALCULATIONS TREE ===");
    console.log(JSON.stringify(treePayload, null, 2));
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      
      {/* Pasek narzędziowy */}
      <div className="action-bar">
        <button onClick={generateCalculationTree} className="action-btn primary-btn">
          Generuj strukturę obliczeń 🚀
        </button>

        <div className="dropdown-container">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
            className={`action-btn secondary-btn ${isDropdownOpen ? 'active' : ''}`}
          >
            + Dodaj regułę (Rule) <span className="arrow">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button onClick={() => addNewRule('SELECT')} className="dropdown-item">
                <span className="icon">▼</span> Select List (Enum)
              </button>
              <button onClick={() => addNewRule('RANGE')} className="dropdown-item">
                <span className="icon">🎚️</span> Range
              </button>
              <button onClick={() => addNewRule('BOOLEAN')} className="dropdown-item">
                <span className="icon">⚖️</span> True / False (Boolean)
              </button>
              <button onClick={() => addNewRule('ANY_VALUE')} className="dropdown-item">
                <span className="icon">🔍</span> Has Any Value
              </button>
              <button onClick={() => addNewRule('CALCULATION')} className="dropdown-item">
                <span className="icon">🧮</span> Calculation (Equations / Value)
              </button>
            </div>
          )}
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
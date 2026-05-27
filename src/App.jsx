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

      calculations: allCalculations.map(node => ({
        id: node.id,
        calculationTypeCode: node.data.calculationTypeCode || 'MATH_FORMULA',
        returnMetricType: node.data.returnMetricType || 'NUMBER',
        expression: node.data.expression || ''
      }))

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
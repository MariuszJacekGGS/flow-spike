import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdaterNode } from './components/TextUpdaterNode';
import { SelectListUpdate } from './components/SelectListNode';
import './App.css' 
import { RangeNode } from './components/RangeNode';


const initialNodes = [
  { 
    id: 'n0', 
    type: 'selectList', 
    position: { x: 200, y: 0 }, 
    data: { label: 'Krok 1: Typ Produktu', category: 'Polygon' } 
  },
  { 
    id: 'n1', 
    type: 'range', 
    position: { x: 200, y: 180 }, 
    data: { label: 'Krok 2: Wolumen Zamówienia', rangeValue: 30 } 
  },
  { 
    id: 'n2', 
    type: 'textUpdater', 
    position: { x: 0, y: 380 }, 
    data: { label: 'Ścieżka A: Modyfikator Ceny', text: 'CenaBazowa * 1.0' } 
  },
  { 
    id: 'n3', 
    type: 'textUpdater', 
    position: { x: 400, y: 380 }, 
    data: { label: 'Ścieżka B: Modyfikator Ceny', text: 'CenaBazowa * 0.85 + 0' }
  },
];

const initialEdges = [
  { 
    id: 'e_n0-n1', 
    source: 'n0', 
    sourceHandle: 'source-handle', 
    target: 'n1', 
    type: 'step', 
    animated: true,
    label: 'Jeśli Polygon',
    data: { conditionType: 'equals', value: 'Polygon' } 
  },//jeżeli condition type to range split lub range max
  { 
    id: 'e_n1-n2', 
    source: 'n1', 
    sourceHandle: 'source-handle', 
    target: 'n2', 
    type: 'step', 
    label: 'Ilość <= 50 szt.',
    data: { conditionType: 'lessThanOrEqual', value: 50 } 
  },
  { 
    id: 'e_n1-n3', 
    source: 'n1', 
    sourceHandle: 'source-handle', 
    target: 'n3', 
    type: 'step', 
    label: 'Ilość > 50 szt.',
    data: { conditionType: 'greaterThan', value: 50 } 
  }
];

 
export default function App() {
  
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const nodeTypes = {
    textUpdater: TextUpdaterNode,
    selectList: SelectListUpdate,
    range: RangeNode,
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const addNewNode = (type) => {
    
    const uniqueId = `n_${Date.now()}`;

    const position = {
      x: Math.random() * 150,
      y: Math.random() * 150 + 50,
    };

    const newNode = {
      id: uniqueId,
      type: type,
      position: position,
      data: {
        label: `Node ${nodes.length}`,
        text: '',
        category: 'Polygon',
        rangeValue: type === 'range' ? 30 : 0
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    setIsDropdownOpen(false);

  };

const logFullConfiguration = () => {
  const jsonOutput = {
    updatedAt: new Date().toISOString(),

    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      properties: {
        text: node.data.text || null,
        category: node.data.category || null,
        rangeValue: node.data.rangeValue ?? null
      }
    })),

    rules: edges.map(edge => ({
      id: edge.id,
      fromNode: edge.source,
      toNode: edge.target,
      condition: edge.data?.conditionType ? {
        type: edge.data.conditionType,
        value: edge.data.value
      } : null
    }))
  };

  console.log("=== STRUKTURA SILNIKA REGUŁ BIZNESOWYCH ===");
  console.log(JSON.stringify(jsonOutput, null, 2));
};
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>

    <div className="action-bar">
      
      <button onClick={logFullConfiguration} className="action-btn primary-btn">
        Pokaż konfigurację w konsoli
      </button>

      <div className="dropdown-container">
         <button 
           onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
           className={`action-btn secondary-btn ${isDropdownOpen ? 'active' : ''}`}
         >
           Dodaj nowe node <span className="arrow">▼</span>
         </button>

         {isDropdownOpen && (
           <div className="dropdown-menu">
             <button onClick={() => addNewNode('textUpdater')} className="dropdown-item">
               <span className="icon">📝</span> Text Updater Node
             </button>
             <button onClick={() => addNewNode('selectList')} className="dropdown-item">
               <span className="icon">▼</span> Select List Node
             </button>
             <button onClick={() => addNewNode('range')} className="dropdown-item">
               <span className="icon">🎚️</span> Range Node
             </button>
           </div>
          )}
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
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
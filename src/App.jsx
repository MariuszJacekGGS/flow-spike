import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdaterNode } from './components/TextUpdaterNode';
import { SelectListUpdate } from './components/SelectListNode';
import './App.css' 
import { RangeNode } from './components/RangeNode';

const initialNodes = [
  { id: 'n0', type: 'textUpdater',position: { x: 0, y: 100 }, data: { label: 'Node 0', text: '', category: 'Polygon', rangeValue: 0 } },
  { id: 'n1', type: 'textUpdater', position: { x: 30, y: 0 }, data: { label: 'Node 1', text: '', category: 'Polygon', rangeValue: 0 } },
  { id: 'n2', type: 'selectList', position: { x: 0, y: 200 }, data: { label: 'Node 2', text: '', category: 'Polygon', rangeValue: 0 } },
  { id: 'n3', type: 'selectList', position: { x: 60, y: 205 }, data: { label: 'Node 3', text: '', category: 'Polygon', rangeValue: 0 } },
  { id: 'n4', type: 'range', position: { x: 130, y: 250 }, data: { label: 'Node 4', text: '', category: 'Polygon', rangeValue: 30} },
];

const initialEdges = [{ id: 'n0-n1', source: 'n0', sourceHanle: 'a', target: 'n1', type: 'step', label: 'xD costam xD' },
  { id: 'n1-n2', source: 'n1', sourceHanle: 'a', target: 'n2', type: 'step', label: 'xD costam xD' },
  { id: 'n2-n3', source: 'n2', sourceHanle: 'b', target: 'n3', type: 'step', label: 'xD costam xD' },
  { id: 'n3-n4', source: 'n2', sourceHanle: 'b', target: 'n4', type: 'step', label: 'xD costam xD' }
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
      totalNodes: nodes.length,

      config: nodes.reduce((acc, node) => {
        acc[node.id] = {
          type: node.type,
          text: node.data.text || '',
          category: node.data.category || 'Polygon',
          rangeValue: node.data.rangeValue ?? 50,
          position: node.position
        };
        return acc;
      }, {})
    };

    console.log("=== PEŁNY OBIEKT KONFIGURACYJNY DLA BACKENDU ===");
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
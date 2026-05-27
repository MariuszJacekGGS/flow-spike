import { useState } from "react";
import { useReactFlow } from "@xyflow/react";

export function NodeAdder({ parentNodeId}) {
    
    const [isOpen, setIsOpen] = useState(false);
    const { setNodes, getNode, setEdges } = useReactFlow();

    const handleAddChildNode = (type) => {

        const parentNode = getNode(parentNodeId);

        const parentPos = parentNode ? parentNode.position : { x: 0, y: 0};

        const uniqueId = `n_${Date.now()}`;

        const position = {
            x: parentPos.x,
            y: parentPos.y + 160,
        };

        const newNode = {
            id: uniqueId,
            type: type,
            position: position,
            data: {
                label: `Node`,
                text: '',
                category: 'Polygon',
                rangeValue: type === 'range' ? 30 : 0
            },
        };

        const newEdge = {
            id: `e_${parentNodeId}-${uniqueId}`,
            source: parentNodeId,
            target: uniqueId,
            sourceHandle: 'source-handle',
            targetHandle: 'target-handle',
            type: 'bezier',
            animated: true,
        };

        setNodes((prevNodes) => [...prevNodes, newNode]);
        setEdges((prevEdges) => [...prevEdges, newEdge]);
        setIsOpen(false);
    };

    return (
        <div className="node-add-wrapper">
            <button onClick={() => setIsOpen(!isOpen)} className="node-add-btn" title="Dodaj następny krok">
              {isOpen ? '×' : '+'}
            </button>

            {isOpen && (
              <div className="node-dropdown-menu">
                <button onClick={() => handleAddChildNode('textUpdater')} className="dropdown-item">
                  <span className="icon">📝</span> Text Updater
                </button>
                <button onClick={() => handleAddChildNode('selectList')} className="dropdown-item">
                  <span className="icon">▼</span> Select List
                </button>
                <button onClick={() => handleAddChildNode('range')} className="dropdown-item">
                  <span className="icon">🎚️</span> Range Node
                </button>
              </div>
            )}
        </div>
    );

}
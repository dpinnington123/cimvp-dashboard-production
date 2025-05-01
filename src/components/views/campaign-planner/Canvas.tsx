import React, { useState, useRef, useEffect } from 'react';
import { CanvasNode, Connection, ContentItem, Position } from '@/types/content';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface CanvasProps {
  nodes: CanvasNode[];
  connections: Connection[];
  journeyTitle: string;
  onAddNode: (content: ContentItem, position: Position) => void;
  onMoveNode: (id: string, position: Position) => void;
  onRemoveNode: (id: string) => void;
  onConnect: (fromId: string, toId: string) => void;
  onRemoveConnection: (id: string) => void;
  onTitleChange: (title: string) => void;
}

type DotPosition = 'top' | 'right' | 'bottom' | 'left';

const Canvas: React.FC<CanvasProps> = ({
  nodes,
  connections,
  journeyTitle,
  onAddNode,
  onMoveNode,
  onRemoveNode,
  onConnect,
  onRemoveConnection,
  onTitleChange,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState<{nodeId: string, position: DotPosition} | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [linePreview, setLinePreview] = useState<{start: Position, end: Position} | null>(null);
  const [connectingDot, setConnectingDot] = useState<DotPosition | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(journeyTitle);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitleValue(journeyTitle);
  }, [journeyTitle]);

  useEffect(() => {
    if (editingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTitle]);

  const handleTitleEdit = () => {
    setEditingTitle(true);
  };

  const handleTitleSave = () => {
    onTitleChange(titleValue);
    setEditingTitle(false);
    toast("Title Updated", {
      description: "Your journey title has been updated"
    });
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setTitleValue(journeyTitle);
      setEditingTitle(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    
    try {
      const data = e.dataTransfer.getData('text');
      if (!data) {
        console.log("No data received in drop event");
        return;
      }
      
      let contentData;
      try {
        contentData = JSON.parse(data);
      } catch (error) {
        console.error('Error parsing JSON data:', error);
        toast("Error Adding Content", {
          description: "There was an issue adding the content to the canvas",
          variant: "destructive",
        });
        return;
      }
      
      if (!contentData) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - 75,
        y: e.clientY - rect.top - 40,
      };
      
      onAddNode(contentData, position);
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNodeDragStart = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (!canvasRef.current) return;
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
    
    setDraggingNode(nodeId);
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (draggingNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left - dragOffset.x,
        y: e.clientY - rect.top - dragOffset.y,
      };
      
      onMoveNode(draggingNode, position);
    } else if (connecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const startNode = nodes.find(n => n.id === connecting.nodeId);
      if (!startNode) return;
      
      const startPos = getDotPosition(startNode, connecting.position);
      
      const currentPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      
      setLinePreview({
        start: startPos,
        end: currentPos,
      });
    }
  };

  const getDotPosition = (node: CanvasNode, dotPosition: DotPosition): Position => {
    const nodeWidth = 150;  // Width of the card
    const nodeHeight = 80;  // Approximate height of the card
    
    switch (dotPosition) {
      case 'top':
        return { x: node.position.x + nodeWidth / 2, y: node.position.y };
      case 'right':
        return { x: node.position.x + nodeWidth, y: node.position.y + nodeHeight / 2 };
      case 'bottom':
        return { x: node.position.x + nodeWidth / 2, y: node.position.y + nodeHeight };
      case 'left':
        return { x: node.position.x, y: node.position.y + nodeHeight / 2 };
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (draggingNode) {
      setDraggingNode(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    } else if (connecting && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      console.log("Mouse up at", mouseX, mouseY);
      
      let closestNode: CanvasNode | null = null;
      let closestDotPos: DotPosition | null = null;
      let closestDistance = Infinity;
      
      for (const node of nodes) {
        if (node.id === connecting.nodeId) continue;
        
        const dotPositions: DotPosition[] = ['top', 'right', 'bottom', 'left'];
        for (const dotPos of dotPositions) {
          const dotPosition = getDotPosition(node, dotPos);
          const dx = mouseX - dotPosition.x;
          const dy = mouseY - dotPosition.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          console.log(`Checking dot at ${dotPos} for node ${node.id}, distance: ${distance}`);
          
          if (distance < 35 && distance < closestDistance) {
            closestDistance = distance;
            closestNode = node;
            closestDotPos = dotPos;
          }
        }
      }
      
      if (closestNode) {
        console.log("Creating connection from", connecting.nodeId, "to", closestNode.id);
        onConnect(connecting.nodeId, closestNode.id);
        toast("Connection Created", {
          description: `Connected "${nodes.find(n => n.id === connecting.nodeId)?.content.name}" to "${closestNode.content.name}"`
        });
      } else {
        console.log("No target found for connection");
      }
      
      setConnecting(null);
      setConnectingDot(null);
      setLinePreview(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  const handleStartConnection = (e: React.MouseEvent, nodeId: string, position: DotPosition) => {
    e.stopPropagation();
    console.log("Starting connection from", nodeId, "at position", position);
    setConnecting({ nodeId, position });
    setConnectingDot(position);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && canvasRef.current) {
      const startPos = getDotPosition(node, position);
      const rect = canvasRef.current.getBoundingClientRect();
      
      setLinePreview({
        start: startPos,
        end: {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
      });
    }
  };

  const handleCompleteConnection = (e: React.MouseEvent, toNodeId: string, position: DotPosition) => {
    e.stopPropagation();
    if (connecting && connecting.nodeId !== toNodeId) {
      console.log("Completing connection to", toNodeId, "at position", position);
      onConnect(connecting.nodeId, toNodeId);
      toast("Connection Created", {
        description: `Connected "${nodes.find(n => n.id === connecting.nodeId)?.content.name}" to "${nodes.find(n => n.id === toNodeId)?.content.name}"`
      });
      setConnecting(null);
      setConnectingDot(null);
      setLinePreview(null);
    }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-green-50 border-green-200';
      case 'draft':
        return 'bg-amber-50 border-amber-200';
      default:
        return '';
    }
  };

  const getStatusVariant = (status: string): "default" | "outline" | "destructive" | "secondary" => {
    switch (status) {
      case 'live':
        return 'default';
      case 'draft':
        return 'destructive';
      case 'planned':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && connecting) {
        setConnecting(null);
        setConnectingDot(null);
        setLinePreview(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [connecting]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const renderConnections = () => {
    return connections.map(connection => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      const fromPos = getDotPosition(fromNode, 'right');
      const toPos = getDotPosition(toNode, 'left');
      
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);
      
      return (
        <div
          key={connection.id}
          className="connector"
          style={{
            left: `${fromPos.x}px`,
            top: `${fromPos.y}px`,
            width: `${distance}px`,
            transform: `rotate(${angle}deg)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRemoveConnection(connection.id);
          }}
        />
      );
    });
  };

  const renderConnectionDot = (nodeId: string, position: DotPosition) => {
    const isConnecting = connecting !== null;
    const isSourceNode = connecting?.nodeId === nodeId;
    const isThisDotActive = isSourceNode && connecting?.position === position;
    
    const dotClassName = `connection-dot ${position} ${isThisDotActive ? 'active' : ''}`;
    
    return (
      <div 
        className={dotClassName}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!isConnecting) {
            handleStartConnection(e, nodeId, position);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isConnecting && !isSourceNode) {
            handleCompleteConnection(e, nodeId, position);
          }
        }}
      />
    );
  };

  const renderLinePreview = () => {
    if (!linePreview) return null;
    
    const { start, end } = linePreview;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return (
      <div
        className="connector-preview"
        style={{
          left: `${start.x}px`,
          top: `${start.y}px`,
          width: `${distance}px`,
          transform: `rotate(${angle}deg)`,
        }}
      />
    );
  };

  return (
    <div
      ref={canvasRef}
      className="canvas-area w-full h-[600px] border rounded-md relative overflow-hidden"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => {
        if (connecting) {
          setConnecting(null);
          setConnectingDot(null);
          setLinePreview(null);
        }
      }}
    >
      <div className="journey-title absolute top-4 left-4 z-10 flex items-center gap-2 max-w-[80%] bg-white bg-opacity-80 p-2 rounded shadow-sm">
        {editingTitle ? (
          <Input
            ref={titleInputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={handleTitleKeyDown}
            placeholder="Enter journey title..."
            className="h-8 text-lg font-medium w-full"
          />
        ) : (
          <>
            <h2 className="text-lg font-medium truncate">
              {journeyTitle || "Untitled Journey"}
            </h2>
            <button 
              onClick={handleTitleEdit}
              className="text-gray-500 hover:text-blue-500"
            >
              <Pencil size={14} />
            </button>
          </>
        )}
      </div>
      
      {renderConnections()}
      {renderLinePreview()}
      
      {nodes.map(node => (
        <div
          key={node.id}
          className="node"
          style={{
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
          }}
          onMouseEnter={() => setHoveredNode(node.id)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <Card 
            className={`w-[150px] shadow-md relative draggable-item ${getNodeStatusColor(node.content.status)}`}
            onMouseDown={(e) => handleNodeDragStart(e, node.id)}
          >
            {renderConnectionDot(node.id, 'top')}
            {renderConnectionDot(node.id, 'right')}
            {renderConnectionDot(node.id, 'bottom')}
            {renderConnectionDot(node.id, 'left')}
            
            <CardContent className="p-3">
              <h3 className="font-medium text-xs truncate mb-1">{node.content.name}</h3>
              <p className="text-xs text-muted-foreground mb-1">{node.content.format}</p>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <Badge variant={node.content.type === 'hero' ? 'default' : 'outline'} className="text-xs">
                    {node.content.type}
                  </Badge>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveNode(node.id);
                    }}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant={getStatusVariant(node.content.status)} className="text-xs">
                    {node.content.status}
                  </Badge>
                  <span className="text-xs">Score: {node.content.qualityScore}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default Canvas;

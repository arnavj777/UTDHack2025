import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Sparkles, Download, Wand2, Share, CheckCircle, AlertCircle } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { api, ApiError } from '../services/api';

interface WireframeData {
  description: string;
  fidelity: number;
  device_type: string;
  svg: string;
  accessibility_score: number;
  suggestions: string[];
  components?: string[];
}

interface CanvasComponent {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

interface ComponentDefinition {
  type: string;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
}

const componentDefinitions: ComponentDefinition[] = [
  { type: 'button', label: 'Button', defaultWidth: 120, defaultHeight: 40 },
  { type: 'textbox', label: 'Text Box', defaultWidth: 200, defaultHeight: 40 },
  { type: 'image', label: 'Image', defaultWidth: 150, defaultHeight: 150 },
  { type: 'label', label: 'Label', defaultWidth: 100, defaultHeight: 24 },
  { type: 'container', label: 'Container', defaultWidth: 300, defaultHeight: 200 },
  { type: 'header', label: 'Header', defaultWidth: 400, defaultHeight: 60 },
  { type: 'title', label: 'Title', defaultWidth: 300, defaultHeight: 48 },
  { type: 'navbar', label: 'Navbar', defaultWidth: 600, defaultHeight: 50 }
];

export function WireframeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [fidelity, setFidelity] = useState([50]);
  const [deviceType, setDeviceType] = useState('desktop');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState('');
  const [wireframe, setWireframe] = useState<WireframeData | null>(null);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  
  // Drag and drop state
  const [components, setComponents] = useState<CanvasComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(1);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    sourceType: 'palette' | 'canvas' | null;
    componentId: string | null;
    componentType: string | null;
    startX: number;
    startY: number;
    componentStartX: number;
    componentStartY: number;
  }>({
    isDragging: false,
    sourceType: null,
    componentId: null,
    componentType: null,
    startX: 0,
    startY: 0,
    componentStartX: 0,
    componentStartY: 0
  });
  const [resizeState, setResizeState] = useState<{
    isResizing: boolean;
    componentId: string | null;
    handle: string | null;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startComponentX: number;
    startComponentY: number;
  }>({
    isResizing: false,
    componentId: null,
    handle: null,
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startComponentX: 0,
    startComponentY: 0
  });
  const [ghostElement, setGhostElement] = useState<{ x: number; y: number; width: number; height: number; label: string } | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  
  // Undo/Redo state management
  const [history, setHistory] = useState<WireframeData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Component history for drag-and-drop operations
  const [componentHistory, setComponentHistory] = useState<CanvasComponent[][]>([]);
  const [componentHistoryIndex, setComponentHistoryIndex] = useState(-1);

  const generated = wireframe !== null;
  
  // Helper function to save wireframe to history
  const saveToHistory = (wf: WireframeData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(wf);
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      return Math.min(newIndex, 49);
    });
  };
  
  // Helper function to save component state to history
  const saveComponentToHistory = useCallback((comps: CanvasComponent[]) => {
    // Deep clone the components array
    const clonedComps = comps.map(c => ({ ...c }));
    
    setComponentHistoryIndex(currentIndex => {
      setComponentHistory(prev => {
        const newHistory = prev.slice(0, currentIndex + 1);
        newHistory.push(clonedComps);
        if (newHistory.length > 50) {
          return newHistory.slice(1);
        }
        return newHistory;
      });
      const newIndex = Math.min(currentIndex + 1, 49);
      return newIndex;
    });
  }, []);
  
  // Undo functionality - handles both wireframe and component history
  const handleUndo = useCallback(() => {
    // Prioritize component history if there are components on canvas
    if (components.length > 0 && componentHistoryIndex >= 0) {
      setComponentHistoryIndex(prevIndex => {
        if (prevIndex > 0) {
          const newIndex = prevIndex - 1;
          const previousComponents = componentHistory[newIndex];
          setComponents(previousComponents ? previousComponents.map(c => ({ ...c })) : []);
          return newIndex;
        } else if (prevIndex === 0) {
          // Go back to initial state (no components)
          setComponents([]);
          return -1;
        }
        return prevIndex;
      });
    } else if (historyIndex >= 0) {
      // Fall back to wireframe history
      setHistoryIndex(prevIndex => {
        if (prevIndex > 0) {
          const newIndex = prevIndex - 1;
          setWireframe(history[newIndex]);
          return newIndex;
        } else if (prevIndex === 0) {
          setWireframe(null);
          return -1;
        }
        return prevIndex;
      });
    }
  }, [history, historyIndex, components, componentHistory, componentHistoryIndex]);
  
  // Redo functionality - handles both wireframe and component history
  const handleRedo = useCallback(() => {
    // Prioritize component history if we're in component history
    if (componentHistoryIndex < componentHistory.length - 1) {
      setComponentHistoryIndex(prevIndex => {
        if (prevIndex < componentHistory.length - 1) {
          const newIndex = prevIndex + 1;
          const nextComponents = componentHistory[newIndex];
          setComponents(nextComponents ? nextComponents.map(c => ({ ...c })) : []);
          return newIndex;
        }
        return prevIndex;
      });
    } else if (historyIndex < history.length - 1) {
      // Fall back to wireframe history
      setHistoryIndex(prevIndex => {
        if (prevIndex < history.length - 1) {
          const newIndex = prevIndex + 1;
          setWireframe(history[newIndex]);
          return newIndex;
        }
        return prevIndex;
      });
    }
  }, [history, historyIndex, componentHistory, componentHistoryIndex]);
  
  const canUndo = historyIndex >= 0 || componentHistoryIndex >= 0;
  const canRedo = historyIndex < history.length - 1 || componentHistoryIndex < componentHistory.length - 1;
  
  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      
      // Delete key for deleting selected component
      if (e.key === 'Delete' && selectedComponent) {
        deleteComponent(selectedComponent);
        return;
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        if (canRedo) {
          handleRedo();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, handleUndo, handleRedo, selectedComponent]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post<{ wireframe: WireframeData; message: string }>('/wireframe/generate/', {
        prompt: prompt,
        fidelity: fidelity[0],
        device_type: deviceType
      });

      const newWireframe = response.wireframe;
      setWireframe(newWireframe);
      saveToHistory(newWireframe);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to generate wireframe. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!refinementPrompt.trim()) {
      setError('Please enter refinement instructions');
      return;
    }

    if (!wireframe) {
      setError('Please generate a wireframe first');
      return;
    }

    setRefining(true);
    setError('');

    try {
      const response = await api.post<{ refined_wireframe: WireframeData; message: string }>('/wireframe/refine/', {
        wireframe_data: wireframe,
        refinement_prompt: refinementPrompt,
        fidelity: wireframe.fidelity,
        device_type: wireframe.device_type
      });

      const newWireframe = response.refined_wireframe;
      setWireframe(newWireframe);
      saveToHistory(newWireframe);
      setRefinementPrompt('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to refine wireframe. Please try again.');
      }
    } finally {
      setRefining(false);
    }
  };

  // Drag and drop handlers
  const handlePaletteItemMouseDown = (e: React.MouseEvent, componentDef: ComponentDefinition) => {
    e.preventDefault();
    setDragState({
      isDragging: true,
      sourceType: 'palette',
      componentId: null,
      componentType: componentDef.type,
      startX: e.clientX,
      startY: e.clientY,
      componentStartX: 0,
      componentStartY: 0
    });
    setGhostElement({
      x: e.clientX - componentDef.defaultWidth / 2,
      y: e.clientY - componentDef.defaultHeight / 2,
      width: componentDef.defaultWidth,
      height: componentDef.defaultHeight,
      label: componentDef.label
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (resizeState.isResizing) {
      handleResize(e);
      return;
    }

    if (!dragState.isDragging) {
      return;
    }

    if (dragState.sourceType === 'palette' && ghostElement) {
      const componentDef = componentDefinitions.find(def => def.type === dragState.componentType);
      if (componentDef) {
        setGhostElement({
          ...ghostElement,
          x: e.clientX - componentDef.defaultWidth / 2,
          y: e.clientY - componentDef.defaultHeight / 2
        });
      }
    }

    if (dragState.sourceType === 'canvas' && dragState.componentId) {
      const component = components.find(c => c.id === dragState.componentId);
      if (!component) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasRect = canvas.getBoundingClientRect();
      const deltaX = e.clientX - dragState.startX;
      const deltaY = e.clientY - dragState.startY;

      let newX = dragState.componentStartX + deltaX;
      let newY = dragState.componentStartY + deltaY;

      newX = Math.max(0, Math.min(newX, canvasRect.width - component.width));
      newY = Math.max(0, Math.min(newY, canvasRect.height - component.height));

      setComponents(prev => prev.map(c => 
        c.id === dragState.componentId 
          ? { ...c, x: newX, y: newY }
          : c
      ));
    }
  }, [dragState, components, resizeState, ghostElement]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (resizeState.isResizing) {
      // Save component state to history after resize (components are already updated in handleResize)
      setComponents(prev => {
        saveComponentToHistory(prev);
        return prev;
      });
      
      setResizeState({
        isResizing: false,
        componentId: null,
        handle: null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0,
        startComponentX: 0,
        startComponentY: 0
      });
      return;
    }

    if (!dragState.isDragging) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      cleanupDragState();
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const isOverCanvas = (
      e.clientX >= canvasRect.left &&
      e.clientX <= canvasRect.right &&
      e.clientY >= canvasRect.top &&
      e.clientY <= canvasRect.bottom
    );

    if (isOverCanvas && dragState.sourceType === 'palette') {
      const componentDef = componentDefinitions.find(def => def.type === dragState.componentType);
      if (componentDef) {
        let x = e.clientX - canvasRect.left + canvas.scrollLeft - componentDef.defaultWidth / 2;
        let y = e.clientY - canvasRect.top + canvas.scrollTop - componentDef.defaultHeight / 2;

        x = Math.max(0, Math.min(x, canvasRect.width - componentDef.defaultWidth));
        y = Math.max(0, Math.min(y, canvasRect.height - componentDef.defaultHeight));

        createComponentOnCanvas(componentDef.type, x, y);
      }
    } else if (dragState.sourceType === 'canvas' && dragState.componentId) {
      // Save component state to history after moving
      setComponents(prev => {
        saveComponentToHistory(prev);
        return prev;
      });
    }

    cleanupDragState();
  }, [dragState, resizeState, saveComponentToHistory]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const cleanupDragState = () => {
    setGhostElement(null);
    setDragState({
      isDragging: false,
      sourceType: null,
      componentId: null,
      componentType: null,
      startX: 0,
      startY: 0,
      componentStartX: 0,
      componentStartY: 0
    });
  };

  const createComponentOnCanvas = (componentType: string, x: number, y: number) => {
    const componentDef = componentDefinitions.find(def => def.type === componentType);
    if (!componentDef) return;

    const componentId = `comp-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    const newComponent: CanvasComponent = {
      id: componentId,
      type: componentType,
      x,
      y,
      width: componentDef.defaultWidth,
      height: componentDef.defaultHeight,
      zIndex: nextZIndex
    };

    setComponents(prev => {
      const updated = [...prev, newComponent];
      // Save component state to history after creation
      saveComponentToHistory(updated);
      return updated;
    });
    setNextZIndex(prev => prev + 1);
    setSelectedComponent(componentId);
  };

  const handleComponentMouseDown = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    selectComponent(componentId);

    const component = components.find(c => c.id === componentId);
    if (!component) return;

    setComponents(prev => prev.map(c => 
      c.id === componentId 
        ? { ...c, zIndex: nextZIndex }
        : c
    ));
    setNextZIndex(prev => prev + 1);

    setDragState({
      isDragging: true,
      sourceType: 'canvas',
      componentId,
      componentType: component.type,
      startX: e.clientX,
      startY: e.clientY,
      componentStartX: component.x,
      componentStartY: component.y
    });
  };

  const selectComponent = (componentId: string) => {
    setSelectedComponent(componentId);
  };

  const deselectAll = () => {
    setSelectedComponent(null);
  };

  const deleteComponent = (componentId: string) => {
    setComponents(prev => {
      const updated = prev.filter(c => c.id !== componentId);
      // Save component state to history after deletion
      saveComponentToHistory(updated);
      return updated;
    });
    if (selectedComponent === componentId) {
      setSelectedComponent(null);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent, componentId: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();

    const component = components.find(c => c.id === componentId);
    if (!component) return;

    setResizeState({
      isResizing: true,
      componentId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: component.width,
      startHeight: component.height,
      startComponentX: component.x,
      startComponentY: component.y
    });
  };

  const handleResize = (e: MouseEvent) => {
    if (!resizeState.isResizing) return;

    const component = components.find(c => c.id === resizeState.componentId);
    if (!component) return;

    const deltaX = e.clientX - resizeState.startX;
    const deltaY = e.clientY - resizeState.startY;
    const handle = resizeState.handle;
    const minSize = 20;

    let newWidth = resizeState.startWidth;
    let newHeight = resizeState.startHeight;
    let newX = resizeState.startComponentX;
    let newY = resizeState.startComponentY;

    if (handle?.includes('e')) {
      newWidth = Math.max(minSize, resizeState.startWidth + deltaX);
    } else if (handle?.includes('w')) {
      newWidth = Math.max(minSize, resizeState.startWidth - deltaX);
      newX = resizeState.startComponentX + (resizeState.startWidth - newWidth);
    }

    if (handle?.includes('s')) {
      newHeight = Math.max(minSize, resizeState.startHeight + deltaY);
    } else if (handle?.includes('n')) {
      newHeight = Math.max(minSize, resizeState.startHeight - deltaY);
      newY = resizeState.startComponentY + (resizeState.startHeight - newHeight);
    }

    if (component.type === 'image') {
      const aspectRatio = resizeState.startWidth / resizeState.startHeight;
      if (handle === 'se' || handle === 'nw') {
        newHeight = newWidth / aspectRatio;
        if (handle === 'nw') {
          newY = resizeState.startComponentY + (resizeState.startHeight - newHeight);
        }
      } else if (handle === 'ne' || handle === 'sw') {
        newHeight = newWidth / aspectRatio;
        if (handle === 'ne') {
          newY = resizeState.startComponentY + (resizeState.startHeight - newHeight);
        }
      }
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, canvasRect.width - newWidth));
      newY = Math.max(0, Math.min(newY, canvasRect.height - newHeight));
    }

    setComponents(prev => prev.map(c => 
      c.id === resizeState.componentId 
        ? { ...c, width: newWidth, height: newHeight, x: newX, y: newY }
        : c
    ));
  };

  const renderComponent = (component: CanvasComponent) => {
    const isSelected = selectedComponent === component.id;
    const baseClasses = "absolute cursor-move transition-outline";
    const selectedClasses = isSelected ? "outline-2 outline-blue-500 outline-offset-[-2px]" : "";

    switch (component.type) {
      case 'button':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-slate-200 border border-slate-400 rounded px-3 py-2 flex items-center justify-center text-sm font-medium text-slate-700`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            Button
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'textbox':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-white border border-slate-400 rounded px-2 py-1 flex items-center text-sm text-slate-500 italic`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            Enter text...
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'image':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-slate-50 border border-slate-300 flex items-center justify-center text-sm text-slate-600 relative overflow-hidden`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              <line x1="0" y1="0" x2="100%" y2="100%" stroke="#ccc" strokeWidth="1" />
              <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ccc" strokeWidth="1" />
            </svg>
            <span className="relative z-10">Image</span>
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'label':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-transparent flex items-center text-sm text-slate-700 px-1 py-0.5`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            Label
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'container':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-transparent border-2 border-dashed border-slate-400 rounded`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'header':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-slate-200 border border-slate-400 rounded flex items-center justify-center text-lg font-semibold text-slate-700`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            Header
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'title':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-transparent flex items-center text-2xl font-bold text-slate-700 px-2 py-1`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            Title
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      case 'navbar':
        return (
          <div
            key={component.id}
            className={`${baseClasses} ${selectedClasses} bg-slate-300 border border-slate-400 flex items-center px-4 gap-6`}
            style={{
              left: `${component.x}px`,
              top: `${component.y}px`,
              width: `${component.width}px`,
              height: `${component.height}px`,
              zIndex: component.zIndex
            }}
            onMouseDown={(e) => handleComponentMouseDown(e, component.id)}
          >
            {['Home', 'About', 'Services', 'Contact'].map((item, idx) => (
              <span key={idx} className="text-sm font-medium text-slate-700 cursor-pointer">{item}</span>
            ))}
            {isSelected && (
              <>
                {['nw', 'ne', 'sw', 'se'].map(handle => (
                  <div
                    key={handle}
                    className={`absolute w-2 h-2 bg-blue-500 border border-white cursor-${handle}-resize`}
                    style={{
                      [handle.includes('n') ? 'top' : 'bottom']: '-4px',
                      [handle.includes('w') ? 'left' : 'right']: '-4px'
                    }}
                    onMouseDown={(e) => handleResizeMouseDown(e, component.id, handle)}
                  />
                ))}
                <button
                  className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-md hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteComponent(component.id);
                  }}
                >
                  ×
                </button>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Realistic accessibility scoring model
  const calculateAccessibilityScores = (wf: WireframeData | null, device: string, fid: number) => {
    if (!wf) {
      return {
        overall: 70,
        categories: [
          { category: 'Color Contrast', score: 75, status: 'pass' },
          { category: 'Touch Target Size', score: 70, status: 'pass' },
          { category: 'Text Readability', score: 65, status: 'warning' },
          { category: 'Screen Reader Support', score: 72, status: 'pass' },
          { category: 'Keyboard Navigation', score: 58, status: 'warning' }
        ]
      };
    }

    const components = wf.components || [];
    const hasButton = components.includes('button') || components.includes('Button');
    const hasForm = components.includes('form') || components.includes('Form') || components.includes('input') || components.includes('Input');
    const hasHeader = components.includes('header') || components.includes('Header') || components.includes('nav') || components.includes('Nav');
    const hasTable = components.includes('table') || components.includes('Table');
    const hasImage = components.includes('image') || components.includes('Image');
    const hasText = components.includes('text') || components.includes('Text') || components.includes('textblock') || components.includes('Text Block');
    
    let colorContrast = 45;
    let touchTargetSize = 50;
    let textReadability = 45;
    let screenReaderSupport = 40;
    let keyboardNavigation = 42;

    if (fid >= 80) {
      colorContrast = 80;
    } else if (fid >= 50) {
      colorContrast = 65;
    } else {
      colorContrast = 50;
    }
    if (hasText && fid >= 60) {
      colorContrast += 5;
    }
    if (hasButton && fid >= 70) {
      colorContrast += 3;
    }
    if (!hasText && !hasButton) {
      colorContrast -= 10;
    }
    colorContrast = Math.min(85, Math.max(10, colorContrast));

    if (device === 'mobile') {
      if (hasButton) {
        touchTargetSize = fid >= 70 ? 82 : fid >= 50 ? 70 : 55;
      } else {
        touchTargetSize = 25;
      }
      if (hasForm && fid >= 60) {
        touchTargetSize += 5;
      }
    } else if (device === 'tablet') {
      touchTargetSize = hasButton ? (fid >= 60 ? 75 : 60) : 45;
    } else {
      touchTargetSize = hasButton ? (fid >= 50 ? 70 : 58) : 50;
    }
    touchTargetSize = Math.min(85, Math.max(10, touchTargetSize));

    if (hasText) {
      textReadability = fid >= 70 ? 78 : fid >= 50 ? 65 : 52;
      if (fid >= 80) {
        textReadability += 5;
      }
    } else {
      textReadability = 20;
    }
    if (hasHeader && fid >= 60) {
      textReadability += 4;
    }
    textReadability = Math.min(85, Math.max(10, textReadability));

    if (hasHeader) {
      screenReaderSupport += 12;
    }
    if (hasButton) {
      screenReaderSupport += 10;
    }
    if (hasForm) {
      screenReaderSupport += 8;
      if (fid >= 60) {
        screenReaderSupport += 6;
      }
    }
    if (hasImage && fid >= 70) {
      screenReaderSupport += 4;
    }
    if (hasTable) {
      screenReaderSupport -= 8;
    }
    screenReaderSupport += 10;
    if (!hasHeader && !hasButton && !hasForm) {
      screenReaderSupport -= 15;
    }
    screenReaderSupport = Math.min(85, Math.max(10, screenReaderSupport));

    if (hasButton) {
      keyboardNavigation += 12;
    }
    if (hasForm) {
      keyboardNavigation += 10;
      if (fid >= 60) {
        keyboardNavigation += 6;
      }
    }
    if (hasHeader) {
      keyboardNavigation += 8;
    }
    if (hasTable) {
      keyboardNavigation -= 10;
    }
    keyboardNavigation += 8;
    if (!hasButton && !hasForm && !hasHeader) {
      keyboardNavigation -= 12;
    }
    keyboardNavigation = Math.min(85, Math.max(10, keyboardNavigation));

    const categories = [
      { 
        category: 'Color Contrast', 
        score: Math.round(colorContrast), 
        status: colorContrast >= 80 ? 'pass' : colorContrast >= 60 ? 'warning' : 'fail' 
      },
      { 
        category: 'Touch Target Size', 
        score: Math.round(touchTargetSize), 
        status: touchTargetSize >= 80 ? 'pass' : touchTargetSize >= 60 ? 'warning' : 'fail' 
      },
      { 
        category: 'Text Readability', 
        score: Math.round(textReadability), 
        status: textReadability >= 75 ? 'pass' : textReadability >= 60 ? 'warning' : 'fail' 
      },
      { 
        category: 'Screen Reader Support', 
        score: Math.round(screenReaderSupport), 
        status: screenReaderSupport >= 80 ? 'pass' : screenReaderSupport >= 60 ? 'warning' : 'fail' 
      },
      { 
        category: 'Keyboard Navigation', 
        score: Math.round(keyboardNavigation), 
        status: keyboardNavigation >= 75 ? 'pass' : keyboardNavigation >= 60 ? 'warning' : 'fail' 
      }
    ];

    const weights = {
      'Color Contrast': 0.20,
      'Touch Target Size': 0.20,
      'Text Readability': 0.20,
      'Screen Reader Support': 0.20,
      'Keyboard Navigation': 0.20
    };

    const overall = Math.round(
      categories.reduce((sum, cat) => sum + (cat.score * weights[cat.category as keyof typeof weights]), 0)
    );

    return { overall, categories };
  };

  const accessibilityData = calculateAccessibilityScores(wireframe, deviceType, fidelity[0]);
  const accessibilityScores = accessibilityData.categories;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="mb-2">Wireframe & Mockup Generator</h1>
          <p className="text-slate-600">Generate wireframes from text descriptions with AI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export to Figma
          </Button>
          <Button variant="outline" className="gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="mb-4">Describe Your Design</h3>
            
            <Textarea 
              placeholder="e.g., Create a mobile banking dashboard with account balance at the top, recent transactions below, and quick action buttons for transfer and pay bills..."
              className="min-h-32 mb-4"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <div className="space-y-4 mb-4">
              <div>
                <label className="mb-2 block">Fidelity Level</label>
                <div className="flex items-center gap-4">
                  <span className="text-slate-600">Low-fi</span>
                  <Slider 
                    value={fidelity} 
                    onValueChange={setFidelity}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-slate-600">High-fi</span>
                </div>
                <div className="flex justify-between mt-2 text-slate-500">
                  <span>Wireframe</span>
                  <span>Mockup</span>
                  <span>Pixel-perfect</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="gap-2" onClick={handleGenerate} disabled={loading || !prompt.trim()}>
                <Sparkles className="w-4 h-4" />
                {loading ? 'Generating...' : 'Generate Wireframe'}
              </Button>
              <Button variant="outline" className="gap-2" onClick={handleRefine} disabled={refining || !wireframe || !refinementPrompt.trim()}>
                <Wand2 className="w-4 h-4" />
                {refining ? 'Refining...' : 'Refine with AI'}
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
                {error}
              </div>
            )}

            {wireframe && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">{wireframe.description}</p>
              </div>
            )}

            {wireframe && (
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium">Refinement Instructions</label>
                <Textarea 
                  placeholder="e.g., Increase button sizes, add more spacing, improve contrast..."
                  className="min-h-20"
                  value={refinementPrompt}
                  onChange={(e) => setRefinementPrompt(e.target.value)}
                />
              </div>
            )}
          </Card>

          {/* Canvas Area with Drag and Drop */}
          <Card className="p-6">
            <div className="mb-4">
              <Tabs defaultValue="wireframe">
                <TabsList>
                  <TabsTrigger value="wireframe">Wireframe</TabsTrigger>
                  <TabsTrigger value="mockup">Mockup</TabsTrigger>
                  <TabsTrigger value="pixel-perfect">Pixel-perfect</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <Tabs defaultValue="desktop" value={deviceType} onValueChange={setDeviceType}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="mobile">Mobile</TabsTrigger>
                  <TabsTrigger value="tablet">Tablet</TabsTrigger>
                  <TabsTrigger value="desktop">Desktop</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleUndo}
                    disabled={!canUndo}
                    title={canUndo ? 'Undo last action' : 'Nothing to undo'}
                  >
                    Undo
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRedo}
                    disabled={!canRedo}
                    title={canRedo ? 'Redo last undone action' : 'Nothing to redo'}
                  >
                    Redo
                  </Button>
                </div>
              </div>

              <TabsContent value="desktop" className="mt-0">
                <div className="flex gap-4">
                  {/* Component Palette */}
                  <div className="w-48 bg-slate-50 border-r border-slate-200 p-4">
                    <h4 className="font-semibold mb-3 text-sm">Components</h4>
                    <div className="space-y-2">
                      {componentDefinitions.map((compDef) => (
                        <div
                          key={compDef.type}
                          className="h-10 bg-white border border-slate-300 rounded flex items-center justify-center cursor-grab active:cursor-grabbing text-sm text-slate-700 hover:bg-slate-100 transition-colors select-none"
                          onMouseDown={(e) => handlePaletteItemMouseDown(e, compDef)}
                        >
                          {compDef.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Canvas */}
                  <div
                    ref={canvasRef}
                    className="flex-1 bg-slate-50 rounded-lg min-h-[600px] border-2 border-dashed border-slate-300 relative overflow-auto"
                    onMouseDown={(e) => {
                      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas')) {
                        deselectAll();
                      }
                    }}
                  >
                    {components.length === 0 && !generated && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-4">
                            <Wand2 className="w-16 h-16 mx-auto" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                          </div>
                          <p>Drag components from the palette or generate with AI</p>
                        </div>
                      </div>
                    )}
                    {generated && wireframe && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center p-4"
                        dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                      />
                    )}
                    {components.map(component => renderComponent(component))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile">
                <div className="flex gap-4">
                  <div className="w-48 bg-slate-50 border-r border-slate-200 p-4">
                    <h4 className="font-semibold mb-3 text-sm">Components</h4>
                    <div className="space-y-2">
                      {componentDefinitions.map((compDef) => (
                        <div
                          key={compDef.type}
                          className="h-10 bg-white border border-slate-300 rounded flex items-center justify-center cursor-grab active:cursor-grabbing text-sm text-slate-700 hover:bg-slate-100 transition-colors select-none"
                          onMouseDown={(e) => handlePaletteItemMouseDown(e, compDef)}
                        >
                          {compDef.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    ref={canvasRef}
                    className="flex-1 bg-slate-50 rounded-lg min-h-[600px] border-2 border-dashed border-slate-300 relative overflow-auto"
                    onMouseDown={(e) => {
                      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas')) {
                        deselectAll();
                      }
                    }}
                  >
                    {components.length === 0 && !generated && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-4">
                            <Wand2 className="w-16 h-16 mx-auto" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                          </div>
                          <p>Drag components from the palette or generate with AI</p>
                        </div>
                      </div>
                    )}
                    {generated && wireframe && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center p-4"
                        dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                      />
                    )}
                    {components.map(component => renderComponent(component))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tablet">
                <div className="flex gap-4">
                  <div className="w-48 bg-slate-50 border-r border-slate-200 p-4">
                    <h4 className="font-semibold mb-3 text-sm">Components</h4>
                    <div className="space-y-2">
                      {componentDefinitions.map((compDef) => (
                        <div
                          key={compDef.type}
                          className="h-10 bg-white border border-slate-300 rounded flex items-center justify-center cursor-grab active:cursor-grabbing text-sm text-slate-700 hover:bg-slate-100 transition-colors select-none"
                          onMouseDown={(e) => handlePaletteItemMouseDown(e, compDef)}
                        >
                          {compDef.label}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div
                    ref={canvasRef}
                    className="flex-1 bg-slate-50 rounded-lg min-h-[600px] border-2 border-dashed border-slate-300 relative overflow-auto"
                    onMouseDown={(e) => {
                      if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains('canvas')) {
                        deselectAll();
                      }
                    }}
                  >
                    {components.length === 0 && !generated && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-4">
                            <Wand2 className="w-16 h-16 mx-auto" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">+</span>
                            </div>
                          </div>
                          <p>Drag components from the palette or generate with AI</p>
                        </div>
                      </div>
                    )}
                    {generated && wireframe && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center p-4"
                        dangerouslySetInnerHTML={{ __html: wireframe.svg }}
                      />
                    )}
                    {components.map(component => renderComponent(component))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Accessibility Score */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4>Accessibility Score</h4>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{accessibilityData.overall}/100</div>
              <Badge variant={accessibilityData.overall >= 80 ? 'secondary' : accessibilityData.overall >= 60 ? 'default' : 'destructive'}>
                {accessibilityData.overall >= 80 ? 'Good' : accessibilityData.overall >= 60 ? 'Fair' : 'Needs Improvement'}
              </Badge>
            </div>

            <div className="space-y-3">
              {accessibilityScores.map((score, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-slate-600">{score.category}</span>
                    <div className="flex items-center gap-2">
                      <span>{score.score}</span>
                      {score.status === 'pass' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        score.status === 'pass' ? 'bg-green-600' : 'bg-orange-500'
                      }`}
                      style={{width: `${score.score}%`}}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" size="sm" className="w-full mt-4">
              View Full Report
            </Button>
          </Card>

          {/* AI Suggestions */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h4>AI Suggestions</h4>
            </div>
            {wireframe && wireframe.suggestions && wireframe.suggestions.length > 0 ? (
              <ul className="space-y-2 text-slate-700">
                {wireframe.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                  <span>Increase button size to 44px for better touch targets</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                  <span>Add more spacing between form fields</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2" />
                  <span>Use higher contrast text for readability</span>
                </li>
              </ul>
            )}
            <Button variant="outline" size="sm" className="w-full mt-4" onClick={handleRefine} disabled={!wireframe || !refinementPrompt.trim()}>
              Apply All
            </Button>
          </Card>

          {/* Export Options */}
          <Card className="p-6">
            <h4 className="mb-4">Export Options</h4>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export to Figma
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as PNG
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as SVG
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="w-4 h-4" />
                Export as React Code
              </Button>
            </div>
          </Card>

          {/* Version History */}
          <Card className="p-6">
            <h4 className="mb-4">Version History</h4>
            <div className="space-y-2 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Current</span>
                <Badge variant="default">Active</Badge>
              </div>
              <div>v1.2 - 2 hours ago</div>
              <div>v1.1 - Yesterday</div>
              <div>v1.0 - 3 days ago</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Ghost Element for Drag Preview */}
      {ghostElement && (
        <div
          ref={ghostRef}
          className="fixed pointer-events-none z-[10000] bg-blue-100/30 border-2 border-dashed border-blue-500 rounded flex items-center justify-center text-sm font-medium text-blue-600 opacity-80"
          style={{
            left: `${ghostElement.x}px`,
            top: `${ghostElement.y}px`,
            width: `${ghostElement.width}px`,
            height: `${ghostElement.height}px`
          }}
        >
          {ghostElement.label}
        </div>
      )}
    </div>
  );
}

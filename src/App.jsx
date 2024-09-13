import './index.css'
import './App.css'
import { useState, useCallback } from 'react'

function LeftPanel({ selectedItem, onTextUpdate ,onWidthUpdate, onHightUpdate, onUrlUpdate  }) {
  const handleDragStart = (e, type) => {
    e.dataTransfer.setData('text/plain', type);
  };

  return (
    <div className="left-panel">
      {!selectedItem && (
              <div className="button-container">
              <button 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'image')}
                className="drag-button"
              >
                圖片元件
              </button>
              <button 
                draggable 
                onDragStart={(e) => handleDragStart(e, 'text')}
                className="drag-button"
              >
                文字元件
              </button>
        </div>
      )}

      {selectedItem && (
        <div className="selected-item-info">
          {selectedItem.type === 'image' ? (<div> 
            <input
            type="text"
            value={selectedItem.width}
            onChange={(e) => onWidthUpdate(selectedItem, e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            value={selectedItem.height}
            onChange={(e) => onHightUpdate(selectedItem, e.target.value)}
            className="input-field"
          />
          <input
            type="text"
            value={selectedItem.url}
            onChange={(e) => onUrlUpdate(selectedItem, e.target.value)}
            className="input-field"
          />
          </div>
          ) : (
            <input
              type="text"
              value={selectedItem.content}
              onChange={(e) => onTextUpdate(selectedItem, e.target.value)}
              className="input-field"
            />
          )}
        </div>
      )}
    </div>
  )
}

function ItemImage({ data }) {
  return (
    <div>
      <img 
        src={data.url} 
        width={data.width} 
        height={data.height}
      />
    </div>
  )
}
function ItemText({ data }) {
  return (
    <div className="item-text">
      {data.content}
    </div>
  )
}

function RightPanel({ items, onDrop, onItemClick }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text');
    onDrop(type);
  };

  return (
    <div 
      className="right-panel"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {items.map((item, index) => (
        <div key={item.key} className="dropped-item" onClick={() => onItemClick(item)}>
            {item.type === 'image' ? (
              <ItemImage data={item} key={item.key}/>
            ) : (
              <ItemText data={item} key={item.key}/>
            )}
        </div>
      ))}
    </div>
  )
}

function App() {

  const [droppedItems, setDroppedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleDrop = (type) => {
    const newItem = type === 'image'
      ? { type: 'image', url: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg', width: '300px', height: '300px' }
      : { type: 'text', content: 'This is a sample text message' };
    
    newItem.key = `${type}-${Date.now()}`;
    setDroppedItems([...droppedItems, newItem]);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const onWidthUpdate = useCallback((data, newContent) => {
    setDroppedItems(prevItems => prevItems.map(item => 
      item.key === data.key ? { ...item, width: newContent } : item
    ));
    setSelectedItem(prevSelected => {
      if (prevSelected && prevSelected.key === data.key) {
        return { ...prevSelected, width: newContent };
      }
      return prevSelected;
    });
  }, []);

  const onHightUpdate = useCallback((data, newContent) => {
    setDroppedItems(prevItems => prevItems.map(item => 
      item.key === data.key ? { ...item, height: newContent } : item
    ));
    setSelectedItem(prevSelected => {
      if (prevSelected && prevSelected.key === data.key) {
        return { ...prevSelected, height: newContent };
      }
      return prevSelected;
    });
  }, []);

  const onUrlUpdate = useCallback((data, newContent) => {
    setDroppedItems(prevItems => prevItems.map(item => 
      item.key === data.key ? { ...item, url: newContent } : item
    ));
    setSelectedItem(prevSelected => {
      if (prevSelected && prevSelected.key === data.key) {
        return { ...prevSelected, url: newContent };
      }
      return prevSelected;
    });
  }, []);

  const onTextUpdate = useCallback((data, newContent) => {
    setDroppedItems(prevItems => prevItems.map(item => 
      item.key === data.key ? { ...item, content: newContent } : item
    ));
    
    setSelectedItem(prevSelected => {
      if (prevSelected && prevSelected.key === data.key) {
        return { ...prevSelected, content: newContent };
      }
      return prevSelected;
    });
  }, []);

  return (
    <div className="app-container">
      <LeftPanel 
        onDrop={handleDrop} 
        selectedItem={selectedItem} 
        onTextUpdate={onTextUpdate} 
        onWidthUpdate={onWidthUpdate}
        onHightUpdate={onHightUpdate}
        onUrlUpdate={onUrlUpdate} 
      />
      <RightPanel 
        items={droppedItems} 
        onDrop={handleDrop} 
        onItemClick={handleItemClick}
      />
    </div>
  )
}

export default App

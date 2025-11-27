import React from 'react';

function Loading({ size = 'normal', text = 'Đang tải...' }) {
  const spinnerSize = {
    small: '16px',
    normal: '20px',
    large: '32px'
  };

  return (
    <div className="flex items-center justify-center gap-2" style={{ padding: '20px' }}>
      <div 
        className="loading" 
        style={{ 
          width: spinnerSize[size], 
          height: spinnerSize[size] 
        }}
      ></div>
      {text && <span className="text-muted">{text}</span>}
    </div>
  );
}

export default Loading;
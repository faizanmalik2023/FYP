import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="Sidebar">
      <div className="Sidebar-section">
        <h2>VesselVision</h2>
        <button className="Upload-btn">UPLOAD IMAGE</button>
        {/* Image controls go here */}
        {/* Model controls go here */}
        {/* Results and insights go here */}
      </div>
    </aside>
  );
}

export default Sidebar;

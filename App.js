import React from 'react';
import ControlPanel from './ControlPanel';
import {  Navbar, Nav } from 'react-bootstrap';

function App() {
  
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">FederatedVessel</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home">Home</Nav.Link>
          <Nav.Link href="#features">About</Nav.Link>
          <Nav.Link href="#pricing">Settings</Nav.Link>
        </Nav>
      </Navbar>

      
      <ControlPanel />
         
    </>
  );
}

export default App;

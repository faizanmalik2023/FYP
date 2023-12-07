import React from 'react';
import { Card } from 'react-bootstrap';

function  ImageDisplay({ imageSrc , title })  {
  return (
    <div>
      <Card>
        <Card.Img variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          {/* Dynamic content goes here */}
        </Card.Body>
      </Card>  

      {/* Download Button 
      <Button variant="primary" style={{ marginTop: '10px' }}>
        Download Results
      </Button>
      
      */}
      </div>
  );
};


export default ImageDisplay;

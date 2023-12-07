import React from 'react';
import { Button, ListGroup, Form, ListGroupItem } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
import ImageDisplay from './ImageDisplay';
import { Container, Row, Col } from 'react-bootstrap';

function ControlPanel ({ onImageUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageSrc, setImageSrc] = useState('');
  const [title, setTitle]=useState('');
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast]=useState(0);
  const[sharpness,setSharpness]=useState(0);
  const [clarity, setClarity] = useState(0); // Initial clarity level

  const [originalImageSrc, setOriginalImageSrc] = useState(''); // State to keep the original image
  


  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    
  };

  const handleFileDisplay=()=>{
    if (selectedFile) {
      const localImageUrl = URL.createObjectURL(selectedFile);
      setOriginalImageSrc(localImageUrl);
      setImageSrc(localImageUrl); // Update the imageSrc state to display the image
      setTitle('Uploaded Image')
    }

  };

  const handleFileUpload = async () => {
    setOriginalImageSrc(imageSrc);//applying all the image pre-processing techniques to the original image before sending it to the server. 
    const formData = new FormData();
    formData.append('image', selectedFile);

    axios.post('http://localhost:5000/predict', formData, {
      responseType: 'blob'  // Important: set the response type to 'blob'
  })
  .then(response => {
      // Create a local URL for the blob object
      const localUrl = URL.createObjectURL(response.data);
      setTitle('Segmented Image')
      setImageSrc(localUrl);
  })
  .catch(error => {
      console.error('Error uploading image:', error);
  });
};

const handleDownload = () => {
  if (!imageSrc) {
    alert("No image to download!");
    return;
  }

  // Create a temporary anchor element to trigger download
  const link = document.createElement('a');
  link.href = imageSrc; // Set the href to the source of the image
  link.setAttribute('download', 'segmented_image.png'); // Set the download attribute with a filename

  // Append to the document and trigger click then remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleBrightnessChange = (event) => {
 const newBrightness = parseFloat(event.target.value);
  setBrightness(newBrightness);
  // adjustImage(); // Adjust the image and update imageSrc
};
const handleContrastChange = (event) => {
 const newContrast = parseFloat(event.target.value);
  setContrast(newContrast);
 // adjustImage(); // Adjust the image and update imageSrc
};
const handleSharpnessChange=(event)=>{
 const newSharpness=parseFloat(event.target.value);
  setSharpness(newSharpness);
 // adjustImage();
}


const handleClarityChange = (event) => {
  const newClarity = parseFloat(event.target.value);
  setClarity(newClarity);
  // You can call a function to apply clarity adjustment here, or use useEffect as shown before
};




const adjustBrightness = (imageData, brightness) => {
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] += 255 * (brightness - 1);     // red
    data[i + 1] += 255 * (brightness - 1); // green
    data[i + 2] += 255 * (brightness - 1); // blue
  }
};
const adjustContrast = (imageData, contrast) => {
  const data = imageData.data;
  const factor = (350 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = truncate(factor * (data[i] - 128) + 128);     // red
    data[i + 1] = truncate(factor * (data[i + 1] - 128) + 128); // green
    data[i + 2] = truncate(factor * (data[i + 2] - 128) + 128); // blue
  }

  function truncate(value) {
    return Math.max(0, Math.min(255, value));
  }
};
const adjustSharpness = (imageData, sharpness) => {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const kernel = [
    [0, -sharpness, 0],
    [-sharpness, 1 + 4 * sharpness, -sharpness],
    [0, -sharpness, 0]
  ];

  const sharpenedData = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const p = (y + ky) * width * 4 + (x + kx) * 4 + c;
            sum += kernel[ky + 1][kx + 1] * data[p];
          }
        }
        const p = (y * width + x) * 4 + c;
        sharpenedData[p] = sum;
      }
      sharpenedData[(y * width + x) * 4 + 3] = 255; // Alpha channel
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = sharpenedData[i];
  }
};

function applyClarity(imageData, clarity) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Clarity kernel - this is a simplistic approach
  const kernel = [
    [-clarity, -clarity, -clarity],
    [-clarity, 1 + 8 * clarity, -clarity],
    [-clarity, -clarity, -clarity]
  ];

  const clarityData = new Uint8ClampedArray(data.length);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const p = (y + ky) * width * 4 + (x + kx) * 4 + c;
            sum += kernel[ky + 1][kx + 1] * data[p];
          }
        }
        const p = (y * width + x) * 4 + c;
        clarityData[p] = Math.min(255, Math.max(0, sum));
      }
      clarityData[(y * width + x) * 4 + 3] = 255; // Alpha channel
    }
  }

  for (let i = 0; i < data.length; i++) {
    data[i] = clarityData[i];
  }
}


useEffect(() => {
  const img = new Image();
  img.src = originalImageSrc;

  img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Apply adjustments
    adjustBrightness(imageData, brightness);
    adjustContrast(imageData, contrast);
    adjustSharpness(imageData, sharpness);
    applyClarity(imageData, clarity); // Apply the clarity adjustment


    ctx.putImageData(imageData, 0, 0);
    setImageSrc(canvas.toDataURL('image/png'));
  };
}, [brightness, contrast, sharpness,clarity, originalImageSrc]);

  return (
    <div  style={{ backgroundColor: '#808080' }}>
      <Container>
        <Row>
        <Col md={4}>
    <ListGroup  style={{ backgroundColor: '#808080' }}>
      <ListGroup.Item>
         <div>
         <input type="file" className='btn' onChange={handleFileChange} />
         </div>
       
      </ListGroup.Item>
      <ListGroupItem>
      <Button className='btn' variant="success" onClick={handleFileDisplay}>Upload Image</Button>

      </ListGroupItem>
      <ListGroup.Item>
        <Button className='btn' variant="success" onClick={handleFileUpload}>Run Segmentation</Button>
      </ListGroup.Item>
      <ListGroup.Item>
        <Button className='btn' variant="info" onClick={handleDownload} >Export Results</Button>
      </ListGroup.Item>

      {/* Image Editor Controls */}
      <ListGroup.Item>
        <Form title='Image Controls'>
            <Form.Label>Image Controls</Form.Label>
          <Form.Group>
            <Form.Label>Brightness</Form.Label>
            <Form.Control type="range"
              min="0"
              max="2"
              step="0.005"
              value={brightness}
              onChange={handleBrightnessChange} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Contrast</Form.Label>
            <Form.Control type="range" 
            min="-20"
            max="20"
            step="5"
            value={contrast}
            onChange={handleContrastChange}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>Sharpness</Form.Label>
            <Form.Control type="range"
            min="-50" // Lower than 0 for less sharpness (blurring)
            max="50"  // Greater than 0 for more sharpness
            step="10"
            value={sharpness}
            onChange={handleSharpnessChange}
             />
          </Form.Group>
          <Form.Group>
            <Form.Label>Clarity</Form.Label>
            <Form.Control type="range"
                min="-10"
                max="10"
                step="1"
                value={clarity}
                onChange={handleClarityChange}
             />
          </Form.Group>
        </Form>
      </ListGroup.Item>
      <ListGroup.Item>
        <Form>
            <Form.Label>Model Analysis</Form.Label>
        </Form>
      </ListGroup.Item>
      <ListGroup.Item>
        
       {/*} <Form>
            <Form.Label>Segmentation Results & Insights</Form.Label>
            <Form.Group> <Form.Label>Accuracy   98.2%</Form.Label></Form.Group>
            <Form.Group><Form.Label>Learning Rate 0.05</Form.Label></Form.Group>
            
  </Form>*/}
      </ListGroup.Item>
    </ListGroup>
    </Col>
    <Col md={8}>    <ImageDisplay imageSrc={imageSrc} title={title}></ImageDisplay></Col>

    </Row>
    </Container>
    </div>
    
  );
};

export default ControlPanel;

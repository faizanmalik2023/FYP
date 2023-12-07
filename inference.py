import torch
import monai
import numpy as np
from skimage import io, transform
from scipy.special import expit
import os
import matplotlib.pyplot as plt

# Function to process the image
def process_image(image_path):
    device = torch.device("cpu")
    
    # Initialize the model
    model = monai.networks.nets.UNet(
        spatial_dims=2,
        in_channels=3,  # Update to the number of channels in your .tif image
        out_channels=1,
        channels=(16, 32, 64, 128, 256),
        strides=(2, 2, 2, 2),
        num_res_units=2,
    ).to(device)

    # Load the trained model weights
    model_path = os.path.join(os.path.dirname(__file__), 'best_metric_model_segmentation2d_dict.pth')
    model.load_state_dict(torch.load(model_path, map_location=device))

    # Read the .tif image using skimage
    image = io.imread(image_path)
    image = image.astype(np.float32) / 255.0

    # Pre-process the image
    image = transform.resize(image, (512, 512), order=3)
    image = image.transpose((2, 0, 1))
    image = torch.from_numpy(image).to(device).unsqueeze(0)  # Add a batch dimension

    # Do the forward pass
    out = model(image).squeeze().data.cpu().numpy()

    # Post-process the image
    out = transform.resize(out,image.shape[-2:] , order=3)  # Resize to the original image shape
    out = (expit(out) > 0.99)
    out = (out * 255).astype(np.uint8)

    # Save the result image
    result_path = os.path.join(os.path.dirname(__file__), 'result.png')
    io.imsave(result_path, out)

    # Return the path of the result image
    return result_path

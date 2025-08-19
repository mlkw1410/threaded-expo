import { HfInference } from '@huggingface/inference';

interface ImageSegmentationOutput {
  mask: string;
  label: string;
  score: number;
}
import { HUGGING_FACE_API_KEY } from '../config';

const hf = new HfInference(HUGGING_FACE_API_KEY);

export const runVirtualTryOn = async (personImage: string, garmentImage: string) => {
  const personImageBlob = await fetch(personImage).then((res) => res.blob());
  const garmentImageBlob = await fetch(garmentImage).then((res) => res.blob());

  const formData = new FormData();
  formData.append('person_image', personImageBlob);
  formData.append('garment_image', garmentImageBlob);

  const response = await fetch('https://xiaozaa-cat-tryoff-flux.hf.space/run/predict', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
    },
    body: formData,
  }).catch((error) => {
    console.error('Error fetching from Hugging Face:', error);
    throw error;
  });

  const result = await response.blob();

  // The result will be a Blob, so you'll need to convert it to a data URL to display it
  return URL.createObjectURL(result);
};

export const generateGarmentDesign = async (imageUri: string) => {
  const imageBlob = await fetch(imageUri).then((res) => res.blob());

  const result = await hf.objectDetection({
    model: 'facebook/detr-resnet-50',
    data: imageBlob,
    threshold: 0.9,
  });

  // The result will be an array of objects, each with a box and a label.
  // I'll need to find the box for the garment and then use it to crop the image.
  console.log('Object detection result:', result);
  const clothingLabels = ['handbag', 'tie', 'suitcase', 'backpack', 'person'];
  const garment = result.find((item) => clothingLabels.includes(item.label));
  if (garment) {
    console.log('Found garment:', garment);
    // TODO: Generate the 2D design from the image.
    // For now, I'll just return the original image.
    return imageUri;
  }

  console.log('No garment found');
  return null;
};
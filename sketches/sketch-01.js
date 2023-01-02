const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const drawCircle = (ctx, x, y, r) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.stroke();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.lineWidth = width * 0.005;
    
    const arraySize = 10;
    const baseRadius = width * 0.5 / arraySize;
    const offset = baseRadius / 3;
    const radius = baseRadius - offset / 2;
    const diameter = radius * 2;
    const originOffset = radius + context.lineWidth / 2 + offset / 2;

    let xPosition, yPosition, seed;
    for (let i = 0; i < arraySize; i++) {
      for (let j = 0; j < arraySize; j++) {
        xPosition = originOffset + i * diameter + offset * i;
        yPosition = originOffset + j * diameter + offset * j;
        seed = Math.random();

        context.strokeStyle = `rgba(0, 0, 0, ${seed})`;
        drawCircle(context, xPosition, yPosition, radius);
        
        if (seed > 0.8) {
          drawCircle(context, xPosition, yPosition, radius - radius * 0.3);
        }
      }
    }
  };
};

canvasSketch(sketch, settings);

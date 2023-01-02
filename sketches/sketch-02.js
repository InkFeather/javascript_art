const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const drawWithContextOperations = (ctx, drawFunc) => {
  ctx.save();
  drawFunc();
  ctx.restore();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'black';
    
    const cx = width * 0.5;
    const cy = height * 0.5;

    const w = width * 0.01;
    const h = height * 0.1;
    let x, y;

    const num = 25;
    const radius = width * 0.3;

    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      x = cx + radius * Math.sin(angle);
      y = cy + radius * Math.cos(angle);

      drawWithContextOperations(context, () => {
        context.translate(x, y);
        context.rotate(-angle);
        context.scale(random.range(0.1, 2), random.range(0.2, 0.5));

        context.fillStyle = `hsla(0, 0%, ${random.range(10, 45)}%, ${random.range(75, 100)}%)`;
  
        context.beginPath();
        context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
        context.fill();
      });

      drawWithContextOperations(context, () => {
        context.translate(cx, cy);
        context.rotate(-angle);

        context.lineWidth = random.range(5, 20);
        context.strokeStyle = `hsl(0, 0%, ${random.range(0, 75)}%)`;

        context.beginPath();
        context.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5));
        context.stroke();
      });
    }
  };
};

canvasSketch(sketch, settings);

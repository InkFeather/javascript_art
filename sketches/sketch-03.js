const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const drawWithContextOperations = (ctx, drawFunc) => {
  ctx.save();
  drawFunc();
  ctx.restore();
};

const sketch = ({ width, height }) => {
  const agents = [];

  for (let i = 0; i < 40; i++) {
    const radius = random.range(4, 12);
    const x = random.range(radius, width - radius);
    const y = random.range(radius, height - radius);
    agents.push(new Agent(x, y, radius));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];
        const minimalLinkDistance = (agent.radius + other.radius) * 9;

        const distance = agent.position.getDistance(other.position);
        if (distance > minimalLinkDistance) continue;

        const smallestRadius = agent.radius < other.radius ? agent.radius : other.radius;
        const linkWidth = math.mapRange(distance, 0, minimalLinkDistance, smallestRadius * 2, 1);
        const linkLightness = distance * 100 / minimalLinkDistance;

        context.beginPath();
        context.moveTo(agent.position.x, agent.position.y);
        context.lineTo(other.position.x, other.position.y);
        context.lineWidth = linkWidth;
        context.strokeStyle = `hsl(0, 0%, ${linkLightness}%)`;
        context.stroke();
      }
    }

    agents.forEach(agent => {
      context.strokeStyle = 'black';
      agent.update();
      agent.draw(context);
      agent.wrap(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y, radius = 10) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = radius;
    this.lineWidth = 4;
  }

  // noinspection JSUnusedGlobalSymbols
  bounce(width, height) {
    if (this.position.x < this.radius + this.lineWidth || this.position.x > width - this.radius - this.lineWidth) {
      this.velocity.x *= -1;
    }

    if (this.position.y < this.radius + this.lineWidth || this.position.y > height - this.radius - this.lineWidth) {
      this.velocity.y *= -1;
    }
  }

  // noinspection JSUnusedGlobalSymbols
  wrap(width, height) {
    const offset = this.radius + this.lineWidth;

    if (this.position.x > width + this.radius + this.lineWidth) {
      this.position.x = offset * -1;
    }
    if (this.position.x < (this.radius + this.lineWidth) * -1) {
      this.position.x = width + offset;
    }

    if (this.position.y > height + this.radius + this.lineWidth) {
      this.position.y = offset * -1;
    }
    if (this.position.y < (this.radius + this.lineWidth) * -1) {
      this.position.y = height + offset;
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  draw(ctx) {
    drawWithContextOperations(ctx, () => {
      ctx.translate(this.position.x, this.position.y);

      ctx.lineWidth = this.lineWidth;

      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke()
    });
  }
}

const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');


const colors = ['black', 'black', 'black', 'black' ];

let circleStates = [];
let arrowPositions = [];

const circleRadius = 30;
const circleX = 50;
const circleYStart = 50;
const circleSpacing = 50;

const arrowStartX = 250;
const arrowEndX = 350;
const arrowHeadSize = 8;

for (let i = 0; i < colors.length; i++) {
  circleStates.push({
    x: circleX,
    y: circleYStart + i * circleSpacing,
    color: colors[i],
    hit: false,
  });
  arrowPositions.push({
    x: arrowStartX,
    y: circleYStart + i * circleSpacing,
    moving: false,
  });
}

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the circles
  for (let i = 0; i < circleStates.length; i++) {
    const circle = circleStates[i];
    context.beginPath();
    context.arc(circle.x, circle.y, circleRadius, 0, 2 * Math.PI, false);
    context.fillStyle = circle.hit ? '#808080' : circle.color;
    context.fill();
    context.closePath();
  }

  for (let i = 0; i < arrowPositions.length; i++) {
    const arrow = arrowPositions[i];
    context.beginPath();
    context.moveTo(arrow.x, arrow.y);
    context.lineTo(arrow.x + arrowHeadSize, arrow.y - arrowHeadSize);
    context.lineTo(arrow.x + arrowHeadSize, arrow.y + arrowHeadSize);
    context.closePath();
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.stroke();
  }
}

function animate() {
  for (let i = 0; i < arrowPositions.length; i++) {
    const arrow = arrowPositions[i];
    if (arrow.moving) {
      const circle = circleStates[i];
      const dx = circle.x - arrow.x;
      const dy = circle.y - arrow.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < circleRadius) {
        circle.hit = true;
        arrow.moving = false;
      } else {

        arrow.x += dx / distance;
        arrow.y += dy / distance;
      }
    }
  }

  draw();

  if (arrowPositions.some((arrow) => arrow.moving)) {
    requestAnimationFrame(animate);
  }
}

function handleClick(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < circleStates.length; i++) {
    const circle = circleStates[i];
    const dx = mouseX - circle.x;
    const dy = mouseY - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circleRadius) {
      
      if (!circle.hit) {
        arrowPositions[i].moving = true;
        animate(); 
      }
      break;
    }
  }
}


function handleReset() {
  for (let i = 0; i < circleStates.length; i++) {
    circleStates[i].hit = false;
    arrowPositions[i].moving = false;
    arrowPositions[i].x = arrowStartX;
    arrowPositions[i].y = circleYStart + i * circleSpacing;
  }
  draw();
}


canvas.addEventListener('click', handleClick);
document.getElementById('resetButton').addEventListener('click', handleReset);


draw();

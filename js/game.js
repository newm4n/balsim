
function drawArr(ctx,arr, stroke,fill) {
  ctx.beginPath();
  for (let i = 0; i < arr.length; i+=2) {
    let xx = (arr[i] * 2);
    let yy = (arr[i+1] *2);
    if (i === 0) {
      ctx.moveTo(xx,yy);
    } else {
      ctx.lineTo(xx,yy);
    }
  }
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.strokeStyle  = stroke;
  ctx.fill();
}

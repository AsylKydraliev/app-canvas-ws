import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Circle {
  x: number,
  y: number,
  color: string,
}

interface ServerMessage {
  type: string,
  coordinates: Circle[],
  circleCoordinates: Circle,
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})

export class CanvasComponent implements AfterViewInit, OnDestroy {
  ws!: WebSocket;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('color') color!: ElementRef;
  colors = ['green', 'red', 'yellow', 'black', 'blue'];
  colorCircle!: string;

  ngAfterViewInit() {
    this.ws = new WebSocket('ws://localhost:8000/canvas');
    this.ws.onclose = () => console.log('ws closed');

    this.ws.onmessage = event => {
      const decodedMessage: ServerMessage = JSON.parse(event.data);

      if(decodedMessage.type === 'PREV_CIRCLES'){
        decodedMessage.coordinates.forEach(coordinate => {
          this.onDrawCircle(coordinate.x, coordinate.y, coordinate.color);
        })
      }

      if(decodedMessage.type === 'NEW_CIRCLE') {
        const {x, y, color} = decodedMessage.circleCoordinates;
        this.onDrawCircle(x, y, color);
      }
    }
  }

  onSelectColor(event: Event) {
    this.colorCircle = (<HTMLSelectElement>event.target).value;
  }

  onDrawCircle(x: number, y: number, color: string){
    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvasElement.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(x, y,10,0,2*Math.PI);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.fill();
  }

  onClickCanvas(event: MouseEvent){
    const x = event.offsetX;
    const y = event.offsetY;
    const color = this.colorCircle;

    this.ws.send(JSON.stringify({
      type: 'SEND_CIRCLE',
      coordinates: {x, y, color},
    }))
  }

  ngOnDestroy(){
    this.ws.close();
  }
}



import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

interface Message {
  username: string,
  text: string,
}
interface ServerMessage {
  type: string,
  message: Message
}

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})

export class CanvasComponent implements AfterViewInit, OnDestroy {
  ws!: WebSocket;
  @ViewChild('canvas') canvas!: ElementRef;

  ngAfterViewInit() {
    this.ws = new WebSocket('ws://localhost:8000/canvas');
    this.ws.onclose = () => console.log('ws closed');

    this.ws.onmessage = event => {
      const decodedMessage: ServerMessage = JSON.parse(event.data);

      console.log(decodedMessage);
    }
  }

  onClickCanvas(event: MouseEvent){
    const x = event.offsetX;
    const y = event.offsetY;

    const canvasElement: HTMLCanvasElement = this.canvas.nativeElement;
    const ctx = canvasElement.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(x,y,10,0,2*Math.PI);
    ctx.stroke();
  }

  ngOnDestroy(){
    this.ws.close();
  }

}

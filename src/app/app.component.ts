import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { takeUntil, map, mergeMap, filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'advMock5';
  left: any;
  top: any;
  subscription: Subscription;
  stylObj: object = {};
  @ViewChild('myCanvas') myCanvasEl: ElementRef;
  ctx: any;
  canvas: any;

  ngOnInit() {
    this.mouseMove();
  }

  ngAfterViewInit() {
    this.canvas = this.myCanvasEl.nativeElement;
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = window.innerHeight - 20;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
    this.ctx.lineWidth = 30;
  }

  private mouseMove(): void {
    const mouseMove = fromEvent(document, 'mousemove')
      .pipe(
        map((move: MouseEvent) => {
          return {
            left: move.clientX,
            top: move.clientY
          }
        }));
    mouseMove.subscribe((pos) => {
      this.left = pos.left, this.top = pos.top;
    });
    const down$ = fromEvent(document, 'mousedown')
    const up$ = fromEvent(document, 'mouseup')
    const paints$ = down$.pipe(
      mergeMap(down => mouseMove.pipe(takeUntil(up$)))
    );
    paints$.subscribe(data => this.paint());
  }
  paint(): void {
    let infiniteX = Infinity;
    let infiniteY = Infinity;
    let colorHue = 230;
    this.ctx.strokeStyle = `hsl(${colorHue}, 100%, 60%)`;
    this.ctx.beginPath();
    if (Math.abs(infiniteX - this.left) < 100 && Math.abs(infiniteY - this.top) < 100) {
      this.ctx.moveTo(infiniteX, infiniteY);
    }
    this.ctx.lineTo(this.left, this.top);
    this.ctx.stroke();
    infiniteX = this.left;
    infiniteY = this.top;
    colorHue++;
    console.log("infiniteX = " + infiniteX + " infiniteY = " + infiniteY);
  }

}

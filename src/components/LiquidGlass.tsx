"use client";

import React, { Component, createRef } from "react";

interface LiquidGlassProps {
  width?: number;
  height?: number;
  className?: string;
  onDestroy?: () => void;
}

interface LiquidGlassState {
  isDragging: boolean;
  position: { x: number; y: number };
  mousePosition: { x: number; y: number };
}

interface Vec2 {
  x: number;
  y: number;
}

interface TextureResult {
  type: "t";
  x: number;
  y: number;
}

class LiquidGlass extends Component<LiquidGlassProps, LiquidGlassState> {
  private containerRef = createRef<HTMLDivElement>();
  private svgRef = createRef<SVGSVGElement>();
  private canvasRef = createRef<HTMLCanvasElement>();
  private feImageRef = createRef<SVGFEImageElement>();
  private feDisplacementMapRef = createRef<SVGFEDisplacementMapElement>();

  private canvasContext: CanvasRenderingContext2D | null = null;
  private canvasDPI = 1;
  private id: string;
  private offset = 10;
  private mouseUsed = false;
  private startPosition = { x: 0, y: 0 };
  private initialPosition = { x: 0, y: 0 };

  constructor(props: LiquidGlassProps) {
    super(props);

    this.id = this.generateId();
    this.state = {
      isDragging: false,
      position: { x: 0, y: 0 },
      mousePosition: { x: 0, y: 0 },
    };
  }

  override componentDidMount() {
    this.setupCanvas();
    this.setupEventListeners();
    this.centerComponent();
    this.updateShader();
  }

  override componentWillUnmount() {
    this.removeEventListeners();
    if (this.props.onDestroy) {
      this.props.onDestroy();
    }
  }

  private generateId(): string {
    return "liquid-glass-" + Math.random().toString(36).substr(2, 9);
  }

  private setupCanvas() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    const width = this.props.width || 300;
    const height = this.props.height || 200;

    canvas.width = width * this.canvasDPI;
    canvas.height = height * this.canvasDPI;
    this.canvasContext = canvas.getContext("2d");
  }

  private centerComponent() {
    const container = this.containerRef.current;
    if (!container) return;

    const width = this.props.width || 300;
    const height = this.props.height || 200;

    const centerX = (window.innerWidth - width) / 2;
    const centerY = (window.innerHeight - height) / 2;

    const constrained = this.constrainPosition(centerX, centerY);
    this.setState({ position: constrained });
  }

  private constrainPosition(x: number, y: number): { x: number; y: number } {
    const width = this.props.width || 300;
    const height = this.props.height || 200;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const minX = this.offset;
    const maxX = viewportWidth - width - this.offset;
    const minY = this.offset;
    const maxY = viewportHeight - height - this.offset;

    const constrainedX = Math.max(minX, Math.min(maxX, x));
    const constrainedY = Math.max(minY, Math.min(maxY, y));

    return { x: constrainedX, y: constrainedY };
  }

  private setupEventListeners() {
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    window.addEventListener("resize", this.handleWindowResize);
  }

  private removeEventListeners() {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("resize", this.handleWindowResize);
  }

  private handleMouseDown = (e: React.MouseEvent) => {
    const container = this.containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    this.startPosition = { x: e.clientX, y: e.clientY };
    this.initialPosition = { x: rect.left, y: rect.top };

    this.setState({ isDragging: true });
    e.preventDefault();
  };

  private handleMouseMove = (e: MouseEvent) => {
    const container = this.containerRef.current;
    if (!container) return;

    if (this.state.isDragging) {
      const deltaX = e.clientX - this.startPosition.x;
      const deltaY = e.clientY - this.startPosition.y;

      const newX = this.initialPosition.x + deltaX;
      const newY = this.initialPosition.y + deltaY;

      const constrained = this.constrainPosition(newX, newY);
      this.setState({ position: constrained });
    }

    const rect = container.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    this.setState({ mousePosition: { x: mouseX, y: mouseY } });

    if (this.mouseUsed) {
      this.updateShader();
    }
  };

  private handleMouseUp = () => {
    this.setState({ isDragging: false });
  };

  private handleWindowResize = () => {
    const constrained = this.constrainPosition(
      this.state.position.x,
      this.state.position.y
    );

    if (
      this.state.position.x !== constrained.x ||
      this.state.position.y !== constrained.y
    ) {
      this.setState({ position: constrained });
    }
  };

  private smoothStep(a: number, b: number, t: number): number {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  private length(x: number, y: number): number {
    return Math.sqrt(x * x + y * y);
  }

  private roundedRectSDF(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ): number {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return (
      Math.min(Math.max(qx, qy), 0) +
      this.length(Math.max(qx, 0), Math.max(qy, 0)) -
      radius
    );
  }

  private texture(x: number, y: number): TextureResult {
    return { type: "t", x, y };
  }

  private fragment = (uv: Vec2, _mouse: Vec2): TextureResult => {
    const ix = uv.x - 0.5;
    const iy = uv.y - 0.5;
    const distanceToEdge = this.roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
    const displacement = this.smoothStep(0.8, 0, distanceToEdge - 0.15);
    const scaled = this.smoothStep(0, 1, displacement);
    return this.texture(ix * scaled + 0.5, iy * scaled + 0.5);
  };

  private updateShader() {
    if (
      !this.canvasContext ||
      !this.feImageRef.current ||
      !this.feDisplacementMapRef.current
    )
      return;

    const mouseProxy = new Proxy(this.state.mousePosition, {
      get: (target, prop) => {
        this.mouseUsed = true;
        return target[prop as keyof Vec2];
      },
    });

    this.mouseUsed = false;

    const width = this.props.width || 300;
    const height = this.props.height || 200;
    const w = width * this.canvasDPI;
    const h = height * this.canvasDPI;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy);
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }

    maxScale *= 0.5;

    let index = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[index++]! / maxScale + 0.5;
      const g = rawValues[index++]! / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.canvasContext.putImageData(new ImageData(data, w, h), 0, 0);
    const canvas = this.canvasRef.current;
    if (canvas) {
      this.feImageRef.current.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        canvas.toDataURL()
      );
      this.feDisplacementMapRef.current.setAttribute(
        "scale",
        (maxScale / this.canvasDPI).toString()
      );
    }
  }

  override render() {
    const width = this.props.width || 300;
    const height = this.props.height || 200;

    const containerStyle: React.CSSProperties = {
      position: "fixed",
      left: `${this.state.position.x}px`,
      top: `${this.state.position.y}px`,
      width: `${width}px`,
      height: `${height}px`,
      overflow: "hidden",
      borderRadius: "150px",
      boxShadow:
        "0 4px 8px rgba(0, 0, 0, 0.25), 0 -10px 25px inset rgba(0, 0, 0, 0.15)",
      cursor: this.state.isDragging ? "grabbing" : "grab",
      backdropFilter: `url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1)`,
      zIndex: 9999,
      pointerEvents: "auto",
    };

    const svgStyle: React.CSSProperties = {
      position: "fixed",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 9998,
    };

    return (
      <>
        <svg
          ref={this.svgRef}
          xmlns="http://www.w3.org/2000/svg"
          width="0"
          height="0"
          style={svgStyle}
        >
          <defs>
            <filter
              id={`${this.id}_filter`}
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
              x="0"
              y="0"
              width={width.toString()}
              height={height.toString()}
            >
              <feImage
                ref={this.feImageRef}
                id={`${this.id}_map`}
                width={width.toString()}
                height={height.toString()}
              />
              <feDisplacementMap
                ref={this.feDisplacementMapRef}
                in="SourceGraphic"
                in2={`${this.id}_map`}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        <div
          ref={this.containerRef}
          className={this.props.className}
          style={containerStyle}
          onMouseDown={this.handleMouseDown}
        />

        <canvas ref={this.canvasRef} style={{ display: "none" }} />
      </>
    );
  }
}

export default LiquidGlass;

import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
import React from "react";
import Konva from "konva";

import { Button } from "@keystone-ui/button";

import { useJson } from "./hooks/useJson";

type Point = { x: number; y: number };
const initialValue: Point[] = [] as const;

export default function Kanvas({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
  const { data, setData } = useJson<Point[]>({
    value,
    onChange,
    initialValue,
  });

  const stageRef = React.useRef<Konva.Stage>(null);
  const divRef = React.useRef<HTMLDivElement>(null);
  const layerRef = React.useRef<Konva.Layer>(null);

  const [ratio, setRatio] = React.useState<number>();
  const [width, setWidth] = React.useState<number>(1);
  const height = React.useMemo(() => {
    if (!width || !ratio) return 0;
    return width * ratio;
  }, [width, ratio]);

  const image = React.useMemo(() => {
    const img = new Image();
    img.src =
      "https://pub-b55630bf7f0b47a1b7d4cfd51da53a77.r2.dev/images/d5776adc-5c89-4f1e-b41b-2d42a00a212a.png";
    img.onload = () => {
      setRatio(img.height / img.width);
    };
    return img;
  }, []);

  React.useEffect(() => {
    setWidth(divRef.current?.clientWidth);

    function onResize() {
      if (divRef.current?.clientWidth !== width) {
        setWidth(divRef.current?.clientWidth);
      }
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [width]);

  const addPointOnClick = () => {
    const pos = stageRef.current?.getPointerPosition();
    if (!pos) return;
    const point = { x: pos.x / width, y: pos.y / height };
    return setData((prev) => [...prev, point]);
  };

  // Redraw circles when data changes
  const redraw = React.useCallback(() => {
    layerRef.current?.destroyChildren();
    data.map((point) => {
      const circle = new Konva.Circle({
        x: point.x * width,
        y: point.y * height,
        radius: 15,
        stroke: "cyan",
        strokeWidth: 3,
      });
      layerRef.current?.add(circle);
    });
  }, [data, height, width]);

  React.useEffect(() => {
    redraw();
  }, [data, redraw]);

  return (
    <div ref={divRef}>
      <Stage
        ref={stageRef}
        onTap={addPointOnClick}
        onClick={addPointOnClick}
        height={height}
        width={width}
      >
        {/* Background image layer */}
        <Layer>
          <KonvaImage image={image} width={width} height={height}></KonvaImage>
        </Layer>
        {/* Circle layer */}
        <Layer ref={layerRef}></Layer>
      </Stage>
      {/* actions */}
      <div
        style={{
          padding: "0.5rem",
          display: "flex",
          justifyContent: "end",
          gap: "0.5rem",
        }}
      >
        <Button onClick={() => setData((prev) => prev.slice(0, -1))}>
          Undo
        </Button>
        <Button onClick={() => setData([])}>Clear</Button>
      </div>
    </div>
  );
}

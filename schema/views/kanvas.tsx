import Konva from "konva";
import React from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";

import { Button } from "@keystone-ui/button";

import { useJson } from "./hooks/useJson";
import { BUCKET } from "../../src/lib/variables";

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
    img.src = `https://pub-d480ef342abd4da8a350585414724877.r2.dev/body.png`;
    img.onload = () => {
      setRatio(img.height / img.width);
    };
    return img;
  }, []);

  // set canvas/image width and watch for resize
  React.useEffect(() => {
    setWidth(divRef.current?.clientWidth ?? 1);

    function onResize() {
      if (divRef.current?.clientWidth !== width) {
        setWidth(divRef.current?.clientWidth ?? 1);
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

  // redraw circles when data changes
  const redraw = React.useCallback(() => {
    layerRef.current?.destroyChildren();
    const circles = data.map(
      (point) =>
        new Konva.Circle({
          x: point.x * width,
          y: point.y * height,
          radius: 15,
          stroke: "cyan",
          strokeWidth: 3,
        }),
    );
    layerRef.current?.add(...circles);
  }, [data, height, width]);

  React.useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <div ref={divRef}>
      <Stage
        ref={stageRef}
        height={height}
        width={width}
        onTap={addPointOnClick}
        onClick={addPointOnClick}
      >
        {/* Background image layer */}
        <Layer>
          <KonvaImage image={image} width={width} height={height} />
        </Layer>
        {/* Circle layer */}
        <Layer ref={layerRef} />
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

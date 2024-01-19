import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
import React from "react";
import Konva from "konva";

import { useJson } from "./hooks/useJson";

type FieldValue = {};
const initialValue: FieldValue[] = [] as const;

function ClickedCircle({ x, y }: { x: number; y: number }) {
  return <Circle x={x} y={y} radius={10}></Circle>;
}
export default function Kanvas({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
  const { data, setData } = useJson<string>({
    value,
    onChange,
    initialValue,
  });

  const stageRef = React.useRef<Konva.Stage>(null);
  const divRef = React.useRef<HTMLDivElement>(null);

  const [ratio, setRatio] = React.useState<number>();
  const [width, setWidth] = React.useState<number>();
  const height = React.useMemo(() => {
    return (width ?? 1) * (ratio ?? 1);
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

  return (
    <div ref={divRef} style={{ border: "1px solid black" }}>
      <Stage
        ref={stageRef}
        onClick={(e) => {
          const pos = stageRef.current?.getRelativePointerPosition();
        }}
        height={height}
        width={width}
      >
        {/* Background image layer */}
        <Layer>
          <KonvaImage image={image} width={width} height={height}></KonvaImage>
        </Layer>
        {/* Circle layer */}
        <Layer></Layer>
      </Stage>
    </div>
  );
}

import Konva from "konva";
import React from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import { BUCKET } from "../../src/lib/variables";

import { Button } from "@keystone-ui/button";
import { AlertDialog } from "@keystone-ui/modals";

import { useJson } from "./hooks/useJson";

type Point = { x: number; y: number };
type OldDrawingData = Point[];
type Path = Point[];
type DrawingData = Path[];
type AllDrawingData = [DrawingData, DrawingData, DrawingData, DrawingData];
type DataSetterProp = DrawingData | ((prev: DrawingData) => DrawingData);
const initialValue: AllDrawingData = [[], [], [], []] as const;

function useMediaQuery(query: string) {
  const mediaQuery = React.useMemo(() => window.matchMedia(query), [query]);
  const [match, setMatch] = React.useState(mediaQuery.matches);
  React.useEffect(() => {
    const onChange = () => setMatch(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [mediaQuery]);
  return match;
}

function useMediaQueries() {
  const sm = useMediaQuery("(max-width: 768px)");
  return { sm };
}

const IMAGE_URLS = [
  `${BUCKET.customUrl}/body_back.png`,
  `${BUCKET.customUrl}/body_left.png`,
  `${BUCKET.customUrl}/body_front.png`,
  `${BUCKET.customUrl}/body_right.png`,
] as const;

/// Backgorund Image Layer
function ImageLayer({
  w,
  src,
  setRatio,
}: {
  w: number;
  src: string;
  setRatio: (ratio: number) => void;
}) {
  const [r, setR] = React.useState(0);
  React.useEffect(() => setRatio(r), [r, setRatio]);
  const image = React.useMemo(() => {
    const img = new Image();
    img.onload = () => setR(img.height / img.width);
    img.src = src;
    return img;
  }, [src]);
  return (
    <Layer>
      <KonvaImage image={image} width={w} height={w * r} />
    </Layer>
  );
}

function Frame({
  children,
  w,
  setW,
}: {
  children: React.ReactNode;
  w: number;
  setW: (w: number) => void;
}) {
  const divRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setW(divRef.current?.clientWidth ?? 1);
    function onResize() {
      if (divRef.current?.clientWidth !== w) {
        setW(divRef.current?.clientWidth ?? 1);
      }
    }
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [w, setW]);
  return <div ref={divRef}>{children}</div>;
}

/// Card that handles displaying and drawing for each image
function ImageCard({
  src,
  data,
  setData,
  disabled = false,
}: {
  src: string;
  data: DrawingData;
  setData: (data: DataSetterProp) => void;
  disabled?: boolean;
}) {
  // const divRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<Konva.Stage>(null);
  const layerRef = React.useRef<Konva.Layer>(null);
  const [w, setW] = React.useState(0);
  const [ratio, setRatio] = React.useState(0);
  const h = w * ratio;

  // Drawing
  function getPointerPosition() {
    return stageRef.current?.getPointerPosition();
  }

  function addPoint({
    start = false,
    end = false,
  }: {
    start?: boolean;
    end?: boolean;
  }) {
    const pos = getPointerPosition();
    if (!pos) return;
    const point: Point = { x: pos.x / w, y: pos.y / h };
    setData((prev) => {
      const next = structuredClone(prev);
      const currPath: Path = next.toReversed()[0] ?? [];
      if (next.length === 0) next.push(currPath);
      // start || drawing
      if ((currPath.length === 0 && start) || currPath.length > 0) {
        currPath.push(point);
      }
      // end
      if (end) next.push([]);
      return next;
    });
  }
  function undo() {
    setData((prev) => {
      const next = structuredClone(prev);
      next.pop();
      next.pop();
      next.push([]);
      return next;
    });
  }
  function clear() {
    setData([]);
  }

  // Displaying
  const redraw = React.useCallback(() => {
    const paths = data.map((path) => {
      if (path.length > 0 && path.length <= 3) {
        return new Konva.Circle({
          x: path[0].x * w,
          y: path[0].y * h,
          radius: 10,
          stroke: "red",
        });
      }
      return new Konva.Line({
        points: path.flatMap(({ x, y }) => [x * w, y * h]),
        stroke: "red",
      });
    });
    layerRef.current?.destroyChildren();
    layerRef.current?.add(...paths);
  }, [data, w, h]);

  React.useEffect(() => {
    redraw();
  }, [redraw]);

  return (
    <div style={{ pointerEvents: disabled ? "none" : "auto" }}>
      <Frame w={w} setW={setW}>
        <Stage
          ref={stageRef}
          height={h}
          width={w}
          // draggable={false}
          onTouchStart={() => addPoint({ start: true })}
          onTouchMove={() => addPoint({})}
          onTouchEnd={() => addPoint({ end: true })}
          onMouseDown={() => addPoint({ start: true })}
          onMouseMove={() => addPoint({})}
          onMouseUp={() => addPoint({ end: true })}
        >
          {/* Background image layer */}
          <ImageLayer w={w} src={src} setRatio={setRatio} />
          {/* Drawing layer */}
          <Layer ref={layerRef} />
        </Stage>
      </Frame>
      {!disabled && (
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Button size="small" onClick={undo}>
            Undo
          </Button>
          <Button size="small" onClick={clear}>
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}

function PopupKanvas({
  data,
  setSingleDataFactory,
}: {
  data: AllDrawingData;
  setSingleDataFactory: (i: number) => (data: DataSetterProp) => void;
}) {
  const [show, setShow] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const url = IMAGE_URLS[page];
  return (
    <>
      <Button onClick={() => setShow(true)}>Edit</Button>
      <AlertDialog
        actions={{ confirm: { label: "Close", action: () => setShow(false) } }}
        isOpen={show}
        title={"Edit"}
      >
        <ImageCard
          src={url}
          data={data[page]}
          setData={setSingleDataFactory(page)}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 0",
          }}
        >
          <Button
            size="small"
            onClick={() =>
              setPage(
                (prev) => (prev - 1 + IMAGE_URLS.length) % IMAGE_URLS.length,
              )
            }
          >
            &lt;&lt;&lt; Prev
          </Button>
          <Button size="small" onClick={() => setShow(false)}>
            Close
          </Button>
          <Button
            size="small"
            onClick={() => setPage((prev) => (prev + 1) % IMAGE_URLS.length)}
          >
            Next &gt;&gt;&gt;
          </Button>
        </div>
      </AlertDialog>
    </>
  );
}

/// Main Component
export default function Kanvas({
  value,
  onChange,
}: {
  value: string;
  onChange?: (value: string) => void;
}) {
  const { data, setData } = useJson<AllDrawingData>({
    value,
    onChange,
    initialValue,
  });

  const setSingleDataFactory = (i: number) => {
    return (inputData: DataSetterProp) => {
      setData((prev) => {
        const next = structuredClone(prev);
        next[i] =
          typeof inputData === "function" ? inputData(next[i]) : inputData;
        return next;
      });
    };
  };

  // format old data
  const [formatted, setFormatted] = React.useState(false);
  React.useEffect(() => {
    if (formatted) return;
    if (!data) return;
    setFormatted(true);
    const oldData = data as unknown as OldDrawingData;
    const isOldData = oldData.map((d) => d.x).some((x) => x !== void 0);
    if (isOldData) {
      const translated = [
        oldData
          .filter((p) => p.x < 0.25)
          .map((point) => [{ x: point.x * 4, y: point.y }]),
        oldData
          .filter((p) => p.x >= 0.25 && p.x < 0.5)
          .map((point) => [{ x: (point.x - 0.25) * 4, y: point.y }]),
        oldData
          .filter((p) => p.x >= 0.5 && p.x < 0.75)
          .map((point) => [{ x: (point.x - 0.5) * 4, y: point.y }]),
        oldData
          .filter((p) => p.x >= 0.75)
          .map((point) => [{ x: (point.x - 0.75) * 4, y: point.y }]),
      ];
      setData(translated.map((p) => [...p, []]) as AllDrawingData);
    }
  }, [data, setData, formatted]);
  if (!formatted) return <></>;
  return (
    <div>
      <PopupKanvas data={data} setSingleDataFactory={setSingleDataFactory} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {IMAGE_URLS.map((url, i) => (
          <ImageCard
            key={url}
            src={url}
            data={data[i]}
            setData={setSingleDataFactory(i)}
            disabled
          />
        ))}
      </div>
    </div>
  );
}

import { useJson } from "../../schema/views/hooks/useJson";

type Point = { x: number; y: number };
const initialValue: Point[] = [] as const;

function DrawImage({ url }: { url: string }) {
  return <>{url}</>;
}
export default function DrawPage() {
  const { data, setData } = useJson<Point[][]>({
    value: "[]",
    initialValue: [],
  });
  return (
    <main>
      <DrawImage url={"123"} />
    </main>
  );
}

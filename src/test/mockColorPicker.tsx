// Shared stand-in for antd's ColorPicker, whose popup panel can't be driven in jsdom.
// Use with: vi.mock("antd", async (orig) => ({ ...(await orig()), ColorPicker: MockColorPicker }))
export function MockColorPicker({
  value,
  onChangeComplete,
  children,
}: {
  value: string;
  onChangeComplete: (c: { toHexString: () => string }) => void;
  children?: React.ReactNode;
}) {
  return (
    <span>
      {children}
      <button type="button" onClick={() => onChangeComplete({ toHexString: () => "#123456" })}>
        pick {value}
      </button>
    </span>
  );
}

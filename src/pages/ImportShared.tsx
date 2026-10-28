import { Button, Result } from "antd";
import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { decodeGuide } from "../lib/share";
import { saveGuide } from "../lib/storage";

export default function ImportShared() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const data = params.get("d") ?? "";
  const result = useMemo(() => {
    try {
      return { guide: decodeGuide(data) };
    } catch (e) {
      return { error: (e as Error).message };
    }
  }, [data]);

  if (!result.guide) {
    return (
      <Result
        status="warning"
        title="Couldn't open this share link"
        subTitle={result.error}
        extra={
          <Link to="/">
            <Button>Back to my guides</Button>
          </Link>
        }
      />
    );
  }
  const guide = result.guide;
  return (
    <Result
      status="info"
      title={`Shared styleguide: ${guide.basics.name}`}
      subTitle="Save a copy to this browser to view and edit it."
      extra={
        <Button
          type="primary"
          onClick={() => {
            saveGuide(guide);
            navigate(`/guide/${guide.id}/basics`, { replace: true });
          }}
        >
          Save a copy
        </Button>
      }
    />
  );
}

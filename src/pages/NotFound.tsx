import { Button, Result } from "antd";
import { Link } from "react-router-dom";

export default function NotFound({ title = "Page not found" }: { title?: string }) {
  return (
    <Result
      status="404"
      title={title}
      extra={
        <Link to="/">
          <Button type="primary">Back to my guides</Button>
        </Link>
      }
    />
  );
}

import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
      <div>Not Found</div>
      <Link to={"/"}>Home</Link>
    </>
  );
}

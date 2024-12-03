import Navbar from "../components/Nav/navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar>
        <main>{children}</main>
      </Navbar>
    </>
  );
}

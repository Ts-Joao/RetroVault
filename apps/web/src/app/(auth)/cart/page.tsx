import CartClient from "./CartClient";

export default function Shopping() {
  return (
    <>
      <div className="flex w-full justify-center items-start font-chakra-petch gap-20 mt-10">
        <div className="flex gap-3">
          <CartClient />
        </div>
      </div>
    </>
  );
}
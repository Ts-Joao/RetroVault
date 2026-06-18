import CartClient from "./CartClient";

export default function Shopping() {
  return (
    <div className="w-full bg-[#F4F4F6] font-chakra-petch min-h-[85vh] text-zinc-900 py-10">
      <div className="mx-auto w-[92%] max-w-7xl">
        <CartClient />
      </div>
    </div>
  );
}
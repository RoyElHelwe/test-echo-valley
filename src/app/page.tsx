import ProductList from "@/components/Private/Home/list";
import { GetCurrentSession } from "@/util/sessions";
import Image from "next/image";

export default async function Home() {
  const sessions = await GetCurrentSession();
  if (!sessions)
    return (
      <div className="flex items-center justify-center">
        Please Login first to see all products
      </div>
    );

  return <div>
    <ProductList/>
  </div>;
}

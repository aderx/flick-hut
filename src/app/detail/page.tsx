import { DetailClient } from "@/clients/detail";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailClient />
    </Suspense>
  );
}

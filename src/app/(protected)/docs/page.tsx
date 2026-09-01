"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/user?openapi=true")
      .then((res) => res.json())
      .then(setSpec);
  }, []);

  if (!spec) return <div>Carregando...</div>;

  return (
    <div>
      <SwaggerUI spec={spec} />
    </div>
  );
}

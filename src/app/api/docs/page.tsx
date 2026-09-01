"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import "swagger-ui-react/swagger-ui.css";
import "./swagger.styles.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch("/api/user?openapi=true")
      .then((res) => res.json())
      .then(setSpec);
  }, []);

  if (!spec) return <div className="flex justify-center items-center h-64">Carregando...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SwaggerUI spec={spec} />
    </div>
  );
}

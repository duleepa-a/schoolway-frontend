

import React from "react";
import Image from "next/image";

interface AwarenessPostProps {
  title: string;
  content: string;
  imageUrl: string;
}

const AwarenessPost: React.FC<AwarenessPostProps> = ({ title, content, imageUrl }) => {
  return (
    <div style={{
      border: "1px solid #e0e0e0",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
      padding: "20px",
      maxWidth: "400px",
      background: "#fff",
      margin: "16px auto"
    }}>
      <div style={{ width: "100%", height: "180px", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
        <Image
          src={imageUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          style={{ borderRadius: "8px" }}
        />
      </div>
      <h2 style={{ margin: "16px 0 8px", fontSize: "1.4rem", color: "#2d3748" }}>{title}</h2>
      <p style={{ color: "#4a5568", fontSize: "1rem" }}>{content}</p>
    </div>
  );
};

export default AwarenessPost;

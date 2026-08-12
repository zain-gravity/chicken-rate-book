"use client";

import { useState } from "react";
import { updateShopLogo } from "../actions";
import { Upload, Image as ImageIcon } from "lucide-react";

export default function LogoUpload({ initialLogo }) {
  const [logo, setLogo] = useState(initialLogo);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result;
      
      // Let's compress the image using a canvas before uploading
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setLogo(compressedBase64);
        
        setLoading(true);
        try {
          await updateShopLogo(compressedBase64);
        } catch (error) {
          console.error("Failed to upload logo", error);
        } finally {
          setLoading(false);
        }
      };
      img.src = base64String;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
      <div 
        style={{ 
          width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--border-color)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 
        }}
      >
        {logo ? (
          <img src={logo} alt="Shop Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ImageIcon size={24} color="var(--text-muted)" />
        )}
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Shop Logo</h3>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Add a logo to your rate lists.</p>
        
        <label className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '14px', display: 'inline-flex', width: 'auto', opacity: loading ? 0.5 : 1 }}>
          <Upload size={16} style={{ marginRight: '8px' }} />
          {loading ? "Uploading..." : (logo ? "Change Logo" : "Upload Logo")}
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} disabled={loading} />
        </label>
      </div>
    </div>
  );
}

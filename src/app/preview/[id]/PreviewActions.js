"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Share2, FileImage } from "lucide-react";

export default function PreviewActions({ rateList }) {
  const posterRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const formattedDate = new Date(rateList.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const generateCanvas = async () => {
    if (!posterRef.current) return null;
    const canvas = await html2canvas(posterRef.current, {
      scale: 3, // High resolution
      useCORS: true,
      backgroundColor: "#ffffff",
    });
    return canvas;
  };

  const handleDownloadImage = async () => {
    try {
      setIsGenerating(true);
      const canvas = await generateCanvas();
      if (!canvas) return;
      
      const link = document.createElement("a");
      link.download = `Rates-${rateList.date}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error(err);
      alert("Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      const canvas = await generateCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rates-${rateList.date}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!navigator.canShare) {
      alert("Sharing is not supported on this device/browser. Please download instead.");
      return;
    }

    try {
      setIsGenerating(true);
      const canvas = await generateCanvas();
      if (!canvas) return;

      canvas.toBlob(async (blob) => {
        const file = new File([blob], `Rates-${rateList.date}.png`, { type: "image/png" });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `${rateList.shopName} - Today's Rates`,
            text: `Here are the latest chicken prices for ${formattedDate}`,
            files: [file],
          });
        } else {
          alert("Your device doesn't support sharing files directly. Please download the image instead.");
        }
      }, "image/png");
    } catch (err) {
      console.error(err);
      // Don't alert if user just cancelled share
      if (err.name !== 'AbortError') {
        alert("Failed to share");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Poster Preview */}
      <div style={{ padding: '0 16px', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
        <div 
          ref={posterRef}
          style={{ 
            width: '100%', 
            maxWidth: '500px', 
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 100%)',
            border: '2px solid var(--primary)',
            borderRadius: '24px', 
            padding: '32px 24px', 
            boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative element */}
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.1 }} />
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.1 }} />

          <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative' }}>
            {rateList.logoBase64 && (
              <img 
                src={rateList.logoBase64} 
                alt="Logo" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '16px', border: '3px solid var(--primary)', padding: '2px', backgroundColor: 'white' }} 
              />
            )}
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-1px' }}>
              {rateList.shopName}
            </h2>
            {rateList.shopAddress && (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {rateList.shopAddress}
              </p>
            )}
            <div style={{ display: 'inline-block', backgroundColor: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600' }}>
              {formattedDate}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
            {rateList.items.map((item, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #93c5fd', paddingBottom: '12px' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#334155' }}>
                  {item.name}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-dark)' }}>
                    ₹{item.price}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase' }}>
                    per {item.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rateList.note && (
            <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', fontStyle: 'italic', margin: 0 }}>
                {rateList.note}
              </p>
            </div>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)', fontStyle: 'italic', position: 'relative' }}>
            Thank you for your business!
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleShare} 
          disabled={isGenerating}
          style={{ fontSize: '18px', padding: '16px' }}
        >
          <Share2 size={24} style={{ marginRight: '12px' }} />
          {isGenerating ? "Processing..." : "Share to WhatsApp"}
        </button>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadImage} 
            disabled={isGenerating}
            style={{ flex: 1 }}
          >
            <FileImage size={20} style={{ marginRight: '8px' }} />
            Save Image
          </button>
          
          <button 
            className="btn btn-secondary" 
            onClick={handleDownloadPDF} 
            disabled={isGenerating}
            style={{ flex: 1 }}
          >
            <Download size={20} style={{ marginRight: '8px' }} />
            Save PDF
          </button>
        </div>
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { updateShopAddress } from "../actions";
import { MapPin, Check } from "lucide-react";

export default function AddressUpdate({ initialAddress }) {
  const [address, setAddress] = useState(initialAddress || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSaved(false);
    try {
      await updateShopAddress(address);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Failed to update address", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <MapPin size={20} />
        </div>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Shop Address</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Display this on your price lists</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          placeholder="e.g., 123 Main Market, City"
          className="input-field"
          style={{ marginBottom: 0, flex: 1 }}
        />
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={loading}
          style={{ width: 'auto', padding: '0 20px' }}
        >
          {saved ? <Check size={20} /> : "Save"}
        </button>
      </div>
    </div>
  );
}

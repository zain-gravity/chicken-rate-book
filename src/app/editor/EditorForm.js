"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveRateList } from "../actions";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const DEFAULT_ITEMS = [
  { name: "Whole Chicken (Live)", price: 0, unit: "kg" },
  { name: "Whole Chicken (Dressed)", price: 0, unit: "kg" },
  { name: "Boneless", price: 0, unit: "kg" },
  { name: "Curry Cut", price: 0, unit: "kg" },
  { name: "Drumsticks", price: 0, unit: "kg" },
  { name: "Wings", price: 0, unit: "kg" },
  { name: "Liver", price: 0, unit: "kg" },
];

export default function EditorForm({ lastRateList }) {
  // Use today's date as default
  const today = new Date().toISOString().split('T')[0];
  
  const [date, setDate] = useState(today);
  
  const initialItems = lastRateList ? lastRateList.items : DEFAULT_ITEMS;
  const [items, setItems] = useState(initialItems);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handlePriceChange = (index, value) => {
    const newItems = [...items];
    newItems[index].price = value === '' ? '' : Number(value);
    setItems(newItems);
  };

  const handleItemNameChange = (index, value) => {
    const newItems = [...items];
    newItems[index].name = value;
    setItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "New Item", price: 0, unit: "kg" }]);
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    // Validate
    if (items.some(item => !item.name.trim() || item.price === '' || isNaN(item.price))) {
      setError("Please ensure all items have a valid name and price.");
      setLoading(false);
      return;
    }

    const res = await saveRateList({ date, items });
    
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push(`/preview/${res.id}`);
    }
  };

  return (
    <div className="container">
      <div className="header animate-fade-in" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/dashboard" style={{ color: 'var(--text-main)' }}>
            <div style={{ padding: '8px', backgroundColor: 'var(--surface)', borderRadius: '50%', border: '1px solid var(--border-color)', display: 'flex' }}>
              <ArrowLeft size={20} />
            </div>
          </Link>
          <h1 className="title" style={{ fontSize: '24px' }}>Edit Rates</h1>
        </div>
      </div>

      <div className="card glass-panel animate-fade-in" style={{ animationDelay: '0.1s', marginBottom: '24px' }}>
        <div className="input-group">
          <label className="input-label" htmlFor="date">Date for Rate List</label>
          <input 
            type="date" 
            id="date" 
            className="input-field" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ fontWeight: '600' }}
          />
        </div>
        
        {lastRateList && (
          <div style={{ padding: '12px', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--primary-dark)', borderRadius: 'var(--radius-sm)', fontSize: '14px', marginBottom: '16px' }}>
            Loaded previous rates from {new Date(lastRateList.date).toLocaleDateString()}. Make your changes below.
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div className="animate-fade-in" style={{ animationDelay: '0.2s', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
        {items.map((item, index) => (
          <div key={index} className="card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                value={item.name} 
                onChange={(e) => handleItemNameChange(index, e.target.value)}
                style={{ border: 'none', background: 'transparent', fontSize: '16px', fontWeight: '500', color: 'var(--text-main)', width: '100%', outline: 'none' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                per {item.unit}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-muted)' }}>₹</span>
              <input 
                type="number" 
                value={item.price} 
                onChange={(e) => handlePriceChange(index, e.target.value)}
                style={{ width: '80px', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '18px', fontWeight: '700', textAlign: 'center', backgroundColor: 'var(--bg-color)', color: 'var(--primary)' }}
                min="0"
                step="1"
              />
            </div>

            <button 
              onClick={() => handleRemoveItem(index)}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', animationDelay: '0.3s' }} className="animate-fade-in">
        <button className="btn btn-secondary" onClick={handleAddItem}>
          <Plus size={20} style={{ marginRight: '8px' }} />
          Add Item
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
          <Save size={20} style={{ marginRight: '8px' }} />
          {loading ? "Saving..." : "Save Rates"}
        </button>
      </div>
    </div>
  );
}

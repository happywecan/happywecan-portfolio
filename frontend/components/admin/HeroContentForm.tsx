"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HeroSettings, getHeroSettings, updateHeroSettings } from '../../services/staticContentService';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../services/apiClient';
import { uploadImage } from '../../services/uploadService';

// Import the new Markdown editor
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });


// Sub-component for handling image uploads
const ImageUploadField = ({ label, value, name, onUrlChange }: { label: string, value?: string, name: string, onUrlChange: (name: string, url: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    setUploading(true);
    try {
      const filePath = await uploadImage(file, token);
      onUrlChange(name, filePath);
      toast.success("圖片已上傳，儲存主視覺後才會顯示在首頁。");

    } catch (error: unknown) {
      toast.error(getErrorMessage(error, "Failed to upload image."));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div>
      <label htmlFor={name} className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="text"
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onUrlChange(name, e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleUpload}
          className="hidden"
          accept="image/*"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 whitespace-nowrap"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};


const HeroContentForm: React.FC = () => {
  const [settings, setSettings] = useState<HeroSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial settings
  useEffect(() => {
    const fetchHeroSettings = async () => {
      try {
        setLoading(true);
        const data = await getHeroSettings();
        setSettings(data);
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to load hero settings.");
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroSettings();
  }, []);
  
  const handleUrlChange = (name: string, url: string) => {
    setSettings(prev => prev ? { ...prev, [name]: url } : null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleMdeChange = (value: string | undefined) => {
    setSettings(prev => prev ? { ...prev, hero_bio_content: value || '' } : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const updatedSettings = await updateHeroSettings(settings, token);
      setSettings(updatedSettings);
      toast.success("主視覺設定已儲存，重新整理首頁即可查看。");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to update hero settings.");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500">Loading hero settings...</div>;
  }

  if (!settings) {
    return <div className="text-center text-red-500">{error || '無法載入主視覺設定。'}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-bold text-white mb-2">編輯首頁主視覺</h2>
      <p className="mb-6 text-sm text-gray-400">以下內容會顯示在首頁最上方的主視覺，也會出現在首頁編排預覽中。</p>
      {error && <p role="alert" className="rounded bg-red-950 px-3 py-2 text-sm text-red-200">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="hero_main_title" className="block text-gray-300 text-sm font-bold mb-2">主標題</label>
          <input
            type="text"
            id="hero_main_title"
            name="hero_main_title"
            value={settings.hero_main_title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="hero_subtitle" className="block text-gray-300 text-sm font-bold mb-2">副標題（主標題下方）</label>
          <input
            type="text"
            id="hero_subtitle"
            name="hero_subtitle"
            value={settings.hero_subtitle}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        
        <ImageUploadField
          label="背景圖片（主視覺底圖）"
          name="hero_background_image_url"
          value={settings.hero_background_image_url}
          onUrlChange={handleUrlChange}
        />
        
        <ImageUploadField
          label="個人照片（主視覺右側）"
          name="hero_personal_photo_url"
          value={settings.hero_personal_photo_url}
          onUrlChange={handleUrlChange}
        />

        <div data-color-mode="dark">
          <label htmlFor="hero_bio_content" className="block text-gray-300 text-sm font-bold mb-2">簡介（副標題下方，支援 Markdown）</label>
          <MDEditor
            value={settings.hero_bio_content}
            onChange={handleMdeChange}
            preview="edit"
            height={300}
          />
        </div>
        <div>
          <label htmlFor="hero_button_1_label" className="block text-gray-300 text-sm font-bold mb-2">作品按鈕文字（連到作品區）</label>
          <input
            type="text"
            id="hero_button_1_label"
            name="hero_button_1_label"
            value={settings.hero_button_1_label}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="hero_button_2_label" className="block text-gray-300 text-sm font-bold mb-2">聯絡按鈕文字（連到聯絡區）</label>
          <input
            type="text"
            id="hero_button_2_label"
            name="hero_button_2_label"
            value={settings.hero_button_2_label}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
            required
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
        >
          {submitting ? '儲存中...' : '儲存主視覺'}
        </button>
      </form>
    </div>
  );
};

export default HeroContentForm;


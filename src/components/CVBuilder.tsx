import React, { useState } from 'react';
import { CVData, ChatMessage } from '../types';
import ChatPanel from './ChatPanel';
import EditorPanel from './EditorPanel';
import PreviewPanel from './PreviewPanel';
import { Languages, FileText, MessageSquare, Download, Eye, Edit3 } from 'lucide-react';

const initialCV: CVData = {
  fullName: '',
  jobTitle: '',
  contact: { email: '', phone: '', location: '', linkedin: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
};

export default function CVBuilder() {
  const [cvData, setCvData] = useState<CVData>(initialCV);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [activeTab, setActiveTab] = useState<'chat' | 'edit'>('chat');
  const [mobileView, setMobileView] = useState<'builder' | 'preview'>('builder');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Header / Toggle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-20 print:hidden">
        <div className="flex items-center gap-2 text-blue-900">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <FileText className="text-white w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">AI CV Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLanguage(l => l === 'en' ? 'ar' : 'en')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            <Languages className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileView(v => v === 'builder' ? 'preview' : 'builder')}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm"
          >
            {mobileView === 'builder' ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {mobileView === 'builder' ? (language === 'en' ? 'Preview' : 'معاينة') : (language === 'en' ? 'Edit' : 'تعديل')}
          </button>
        </div>
      </div>

      {/* Left Panel: Input */}
      <div className={`${mobileView === 'builder' ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/2 flex-col border-r border-gray-200 bg-white shadow-sm z-10 print:hidden h-[calc(100vh-73px)] lg:h-screen`}>
        {/* Header (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-blue-900">
            <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">AI CV Builder</h1>
          </div>
          <button
            onClick={() => setLanguage(l => l === 'en' ? 'ar' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium text-gray-700"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'English' : 'عربي'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'chat' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            {language === 'en' ? 'AI Assistant' : 'المساعد الذكي'}
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
              activeTab === 'edit' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            {language === 'en' ? 'Manual Edit' : 'تعديل يدوي'}
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chat' ? (
            <ChatPanel
              cvData={cvData}
              setCvData={setCvData}
              messages={messages}
              setMessages={setMessages}
              language={language}
            />
          ) : (
            <EditorPanel cvData={cvData} setCvData={setCvData} language={language} />
          )}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className={`${mobileView === 'preview' ? 'flex' : 'hidden'} lg:flex w-full lg:w-1/2 bg-gray-100 flex-col relative print:flex print:w-full print:bg-white h-[calc(100vh-73px)] lg:h-screen`}>
        <div className="absolute top-4 right-4 z-20 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-800 transition-colors font-medium text-sm"
          >
            <Download className="w-4 h-4" />
            {language === 'en' ? 'Export PDF' : 'تصدير PDF'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center print:p-0 print:overflow-visible">
          <PreviewPanel cvData={cvData} />
        </div>
      </div>
    </div>
  );
}

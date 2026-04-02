import React from 'react';
import { CVData } from '../types';
import { Plus, Trash2 } from 'lucide-react';

interface EditorPanelProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  language: 'en' | 'ar';
}

export default function EditorPanel({ cvData, setCvData, language }: EditorPanelProps) {
  const handleChange = (field: keyof CVData, value: any) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: keyof CVData['contact'], value: string) => {
    setCvData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const updateArrayItem = (arrayName: 'experience' | 'education', index: number, field: string, value: string) => {
    setCvData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName: 'experience' | 'education') => {
    setCvData(prev => ({
      ...prev,
      [arrayName]: [
        ...prev[arrayName],
        arrayName === 'experience' 
          ? { id: Date.now().toString(), title: '', company: '', startDate: '', endDate: '', description: '' }
          : { id: Date.now().toString(), degree: '', institution: '', graduationDate: '' }
      ]
    }));
  };

  const removeArrayItem = (arrayName: 'experience' | 'education', index: number) => {
    setCvData(prev => {
      const newArray = [...prev[arrayName]];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    setCvData(prev => ({ ...prev, skills }));
  };

  return (
    <div className="p-6 space-y-8" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Personal Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {language === 'en' ? 'Personal Information' : 'المعلومات الشخصية'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
            <input
              type="text"
              value={cvData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Job Title' : 'المسمى الوظيفي'}</label>
            <input
              type="text"
              value={cvData.jobTitle}
              onChange={(e) => handleChange('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Email' : 'البريد الإلكتروني'}</label>
            <input
              type="email"
              value={cvData.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Phone' : 'رقم الهاتف'}</label>
            <input
              type="text"
              value={cvData.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Location' : 'الموقع'}</label>
            <input
              type="text"
              value={cvData.contact.location}
              onChange={(e) => handleContactChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'LinkedIn' : 'لينكد إن'}</label>
            <input
              type="text"
              value={cvData.contact.linkedin}
              onChange={(e) => handleContactChange('linkedin', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {language === 'en' ? 'Professional Summary' : 'ملخص مهني'}
        </h2>
        <textarea
          value={cvData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y"
        />
      </section>

      {/* Experience */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Experience' : 'الخبرات'}
          </h2>
          <button
            onClick={() => addArrayItem('experience')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Add' : 'إضافة'}
          </button>
        </div>
        <div className="space-y-6">
          {cvData.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
              <button
                onClick={() => removeArrayItem('experience', index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                style={language === 'ar' ? { left: '1rem', right: 'auto' } : {}}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pr-8">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Job Title' : 'المسمى الوظيفي'}</label>
                  <input
                    type="text"
                    value={exp.title}
                    onChange={(e) => updateArrayItem('experience', index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Company' : 'الشركة'}</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => updateArrayItem('experience', index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Start Date' : 'تاريخ البدء'}</label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateArrayItem('experience', index, 'startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="e.g. Jan 2020"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'End Date' : 'تاريخ الانتهاء'}</label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateArrayItem('experience', index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="e.g. Present"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Description' : 'الوصف'}</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateArrayItem('experience', index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-y"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {language === 'en' ? 'Education' : 'التعليم'}
          </h2>
          <button
            onClick={() => addArrayItem('education')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            {language === 'en' ? 'Add' : 'إضافة'}
          </button>
        </div>
        <div className="space-y-4">
          {cvData.education.map((edu, index) => (
            <div key={edu.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 relative">
              <button
                onClick={() => removeArrayItem('education', index)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                style={language === 'ar' ? { left: '1rem', right: 'auto' } : {}}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-8">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Degree' : 'الدرجة العلمية'}</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateArrayItem('education', index, 'degree', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Institution' : 'المؤسسة التعليمية'}</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateArrayItem('education', index, 'institution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-medium text-gray-700">{language === 'en' ? 'Graduation Date' : 'تاريخ التخرج'}</label>
                  <input
                    type="text"
                    value={edu.graduationDate}
                    onChange={(e) => updateArrayItem('education', index, 'graduationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          {language === 'en' ? 'Skills' : 'المهارات'}
        </h2>
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700">
            {language === 'en' ? 'Comma separated list' : 'قائمة مفصولة بفواصل'}
          </label>
          <textarea
            value={cvData.skills.join(', ')}
            onChange={handleSkillsChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            placeholder="e.g. React, Node.js, Project Management"
          />
        </div>
      </section>
    </div>
  );
}

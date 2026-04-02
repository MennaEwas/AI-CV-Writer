import React from 'react';
import { CVData } from '../types';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

interface PreviewPanelProps {
  cvData: CVData;
}

export default function PreviewPanel({ cvData }: PreviewPanelProps) {
  const hasContact = cvData.contact.email || cvData.contact.phone || cvData.contact.location || cvData.contact.linkedin;

  return (
    <div className="bg-white shadow-xl w-full max-w-[210mm] min-h-[297mm] p-6 sm:p-10 print:shadow-none print:p-0 print:m-0">
      {/* Header */}
      <header className="border-b-2 border-blue-900 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wider mb-2">
          {cvData.fullName || 'YOUR NAME'}
        </h1>
        <h2 className="text-xl text-blue-900 font-medium mb-4">
          {cvData.jobTitle || 'Professional Title'}
        </h2>
        
        {hasContact && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {cvData.contact.email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-blue-900" />
                <span>{cvData.contact.email}</span>
              </div>
            )}
            {cvData.contact.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-blue-900" />
                <span>{cvData.contact.phone}</span>
              </div>
            )}
            {cvData.contact.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-900" />
                <span>{cvData.contact.location}</span>
              </div>
            )}
            {cvData.contact.linkedin && (
              <div className="flex items-center gap-1.5">
                <Linkedin className="w-4 h-4 text-blue-900" />
                <span>{cvData.contact.linkedin}</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {cvData.summary && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wider mb-3">Professional Summary</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {cvData.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {cvData.experience.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wider mb-4">Experience</h3>
          <div className="space-y-5">
            {cvData.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-900">{exp.title}</h4>
                  <span className="text-sm font-medium text-gray-500">
                    {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                  </span>
                </div>
                <div className="text-blue-900 font-medium text-sm mb-2">{exp.company}</div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {cvData.education.length > 0 && (
        <section className="mb-6">
          <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wider mb-4">Education</h3>
          <div className="space-y-4">
            {cvData.education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                  <span className="text-sm font-medium text-gray-500">{edu.graduationDate}</span>
                </div>
                <div className="text-blue-900 font-medium text-sm">{edu.institution}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {cvData.skills.length > 0 && (
        <section>
          <h3 className="text-lg font-bold text-blue-900 uppercase tracking-wider mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.skills.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

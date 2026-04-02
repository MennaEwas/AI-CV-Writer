import React, { useState, useRef, useEffect } from 'react';
import { CVData, ChatMessage } from '../types';
import { processUserStory } from '../lib/ai';
import { Send, Mic, Square, Loader2, Lightbulb, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ChatPanelProps {
  cvData: CVData;
  setCvData: React.Dispatch<React.SetStateAction<CVData>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  language: 'en' | 'ar';
}

export default function ChatPanel({ cvData, setCvData, messages, setMessages, language }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'ai',
          content: language === 'en' 
            ? "Hi! I'm your AI CV builder. Tell me about your experience, education, and skills. You can type or use voice recording."
            : "أهلاً بك! أنا مساعدك الذكي لبناء السيرة الذاتية. احكي لي عن خبراتك، دراستك، ومهاراتك. يمكنك الكتابة أو استخدام التسجيل الصوتي."
        }
      ]);
    }
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          handleSendAudio(base64data, audioBlob.type);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
      mediaRecorderRef.current = recorder;
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      let errorMessage = language === 'en' ? 'Microphone access denied or not available.' : 'تم رفض الوصول إلى الميكروفون أو غير متوفر.';
      
      if (err.name === 'NotAllowedError' || err.message.includes('not allowed')) {
        errorMessage = language === 'en' 
          ? 'Microphone access is blocked in this context. If you are viewing this in a preview window, please try opening the app in a new tab using the button in the top right, or check your browser permissions.' 
          : 'تم حظر الوصول إلى الميكروفون في هذا السياق. إذا كنت تعرض هذا في نافذة معاينة، يرجى محاولة فتح التطبيق في علامة تبويب جديدة، أو تحقق من صلاحيات المتصفح.';
      }
      
      alert(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const processInput = async (text: string, audioData: { data: string, mimeType: string } | null) => {
    const displayContent = audioData 
      ? (language === 'en' ? '🎤 [Voice Message]' : '🎤 [رسالة صوتية]')
      : text;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: displayContent
    };

    setMessages(prev => [...prev, userMessage]);
    if (!audioData) setInput('');
    setIsLoading(true);

    try {
      const result = await processUserStory(text, audioData, cvData, language);
      
      setCvData(result.updatedCV);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: result.message,
        suggestions: result.suggestions,
        hrTips: result.hrTips
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to process story:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'ai',
        content: language === 'en' ? 'Sorry, I encountered an error. Please try again.' : 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = () => {
    if (!input.trim() || isLoading) return;
    processInput(input.trim(), null);
  };

  const handleSendAudio = (base64data: string, mimeType: string) => {
    processInput('', { data: base64data, mimeType });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
            </div>
            
            {msg.role === 'ai' && (msg.suggestions?.length || msg.hrTips?.length) && (
              <div className="mt-2 space-y-2 w-full max-w-[85%]">
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-blue-800 font-medium text-xs mb-2">
                      <Lightbulb className="w-3.5 h-3.5" />
                      {language === 'en' ? 'Suggested Additions' : 'إضافات مقترحة'}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sug, i) => (
                        <span key={i} className="bg-white text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200">
                          {sug}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {msg.hrTips && msg.hrTips.length > 0 && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-teal-800 font-medium text-xs mb-2">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {language === 'en' ? 'HR Tips' : 'نصائح الموارد البشرية'}
                    </div>
                    <ul className="text-xs text-teal-700 space-y-1 list-disc list-inside">
                      {msg.hrTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex items-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 p-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
          <button
            onClick={toggleRecording}
            className={`p-2.5 rounded-xl transition-colors ${
              isRecording 
                ? 'bg-red-100 text-red-600 hover:bg-red-200 animate-pulse' 
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 shadow-sm border border-gray-200'
            }`}
            title={language === 'en' ? (isRecording ? 'Stop recording' : 'Record voice') : (isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي')}
          >
            {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendText();
              }
            }}
            placeholder={isRecording ? (language === 'en' ? 'Recording... Click stop when done.' : 'جاري التسجيل... انقر للإيقاف.') : (language === 'en' ? 'Tell me about your experience...' : 'احكي لي عن خبراتك...')}
            disabled={isRecording}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-2 text-sm text-gray-800 placeholder-gray-400 outline-none disabled:opacity-50"
            rows={1}
            style={{ height: 'auto' }}
          />
          
          <button
            onClick={handleSendText}
            disabled={(!input.trim() && !isRecording) || isLoading}
            className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

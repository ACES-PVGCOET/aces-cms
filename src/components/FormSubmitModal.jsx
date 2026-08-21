import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, UploadCloud, FileCheck, Send, Sparkles, Mail } from 'lucide-react';
import { uploadToCloudinary, formsApi } from '../services/api';

export function FormSubmitModal({ isOpen, form, onClose, onSubmitResponse }) {
  const [answersMap, setAnswersMap] = useState({});
  const [fillerEmail, setFillerEmail] = useState('');
  const [emailCheckStatus, setEmailCheckStatus] = useState(null); // null | 'checking' | 'exists' | 'available'
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (form && Array.isArray(form.questions)) {
      const initialMap = {};
      form.questions.forEach((q) => {
        initialMap[String(q.question_serial)] = [];
      });
      setAnswersMap(initialMap);
    }
    setFillerEmail('');
    setEmailCheckStatus(null);
    setEmailCheckMsg('');
    setErrorMsg('');
    setIsSubmitting(false);
    setIsSubmittedSuccess(false);
    setUploadingFiles({});
  }, [form, isOpen]);

  if (!isOpen || !form) return null;

  const questions = [...(form.questions || [])].sort((a, b) => (a.question_serial || 0) - (b.question_serial || 0));

  // Check response existence by email
  const checkEmailExistence = async (emailVal) => {
    const trimmed = (emailVal || '').trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailCheckStatus(null);
      setEmailCheckMsg('');
      return;
    }

    try {
      setEmailCheckStatus('checking');
      const formId = form.form_id || form.id;
      const res = await formsApi.checkResponseExists(formId, trimmed);
      if (res && res.exists) {
        setEmailCheckStatus('exists');
        setEmailCheckMsg('A response has already been submitted with this email address.');
      } else {
        setEmailCheckStatus('available');
        setEmailCheckMsg('');
      }
    } catch (err) {
      console.warn('[FormSubmitModal] Check response exists error:', err.message);
      setEmailCheckStatus(null);
      setEmailCheckMsg('');
    }
  };

  // Textual input change
  const handleTextChange = (serial, val) => {
    setAnswersMap((prev) => ({
      ...prev,
      [String(serial)]: val ? [val] : [],
    }));
  };

  // Single choice radio change
  const handleSingleChoice = (serial, val) => {
    setAnswersMap((prev) => ({
      ...prev,
      [String(serial)]: [val],
    }));
  };

  // Multiple choice checkbox toggle
  const handleMultipleChoiceToggle = (serial, optionText) => {
    const current = answersMap[String(serial)] || [];
    const exists = current.includes(optionText);
    const updated = exists ? current.filter((item) => item !== optionText) : [...current, optionText];
    setAnswersMap((prev) => ({
      ...prev,
      [String(serial)]: updated,
    }));
  };

  // File Upload to Cloudinary handler
  const handleFileUpload = async (serial, file, filePolicy) => {
    if (!file) return;

    // Validate size & type extension
    const maxMb = filePolicy?.max_size_mb || 5;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`File "${file.name}" exceeds maximum allowed size of ${maxMb}MB.`);
      return;
    }

    const supportedTypes = (filePolicy?.supported_types || []).map((t) => t.toLowerCase().replace(/^\./, ''));
    if (supportedTypes.length > 0) {
      const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
      if (!supportedTypes.includes(ext)) {
        setErrorMsg(`File extension .${ext} is not allowed. Supported types: [${supportedTypes.join(', ')}]`);
        return;
      }
    }

    try {
      setErrorMsg('');
      setUploadingFiles((prev) => ({ ...prev, [String(serial)]: true }));
      const cloudinaryUrl = await uploadToCloudinary(file, 'form_responses', 'raw');

      setAnswersMap((prev) => ({
        ...prev,
        [String(serial)]: [cloudinaryUrl],
      }));
    } catch (err) {
      console.error('[FormSubmitModal] File upload error:', err);
      setErrorMsg(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [String(serial)]: false }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Check for filler email
    const trimmedEmail = fillerEmail.trim();
    if (!trimmedEmail) {
      setErrorMsg('Form filler email address is mandatory.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (emailCheckStatus === 'exists') {
      setErrorMsg('A response has already been submitted with this email address.');
      return;
    }

    // Check for any ongoing file upload
    if (Object.values(uploadingFiles).some(Boolean)) {
      setErrorMsg('Please wait for file upload to complete before submitting.');
      return;
    }

    // Validate required questions
    for (const q of questions) {
      const serialKey = String(q.question_serial);
      const answerArr = answersMap[serialKey] || [];
      if (q.is_required && answerArr.length === 0) {
        setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}") is mandatory.`);
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await onSubmitResponse(form.form_id || form.id, answersMap, trimmedEmail);
      setIsSubmittedSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Submission failed. Please check your entries.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden text-slate-100 border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">{form.title}</h2>
              <p className="text-xs opacity-70">Fill out and submit form response</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SUBMITTED SUCCESS STATE */}
        {isSubmittedSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-emerald-300">Response Successfully Recorded!</h3>
            <p className="text-xs opacity-80 max-w-md mx-auto">
              Thank you for filling out &quot;{form.title}&quot;. Your response has been securely logged into the ACES Forms Engine for <span className="font-semibold text-emerald-400">{fillerEmail}</span>.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* ACTIVE FORM INPUTS */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Description card */}
            {form.description && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs opacity-90 leading-relaxed">
                {form.description}
              </div>
            )}

            {/* Inactive Warning */}
            {!form.is_active && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>This form is currently closed and no longer accepting responses.</span>
              </div>
            )}

            {/* Question Items */}
            <div className="space-y-5 max-h-[55vh] overflow-y-auto pr-1">
              
              {/* Mandatory Form Filler Identification Card */}
              <div className="p-4 rounded-2xl glass-panel border border-indigo-500/30 bg-indigo-500/5 space-y-2">
                <label className="block text-xs font-bold leading-5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Form Filler Email Address</span>
                    <span className="text-red-400 font-bold">*</span>
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Mandatory Identification
                  </span>
                </label>
                <input
                  type="email"
                  required
                  disabled={!form.is_active}
                  value={fillerEmail}
                  onChange={(e) => {
                    setFillerEmail(e.target.value);
                    if (emailCheckStatus) setEmailCheckStatus(null);
                  }}
                  onBlur={(e) => checkEmailExistence(e.target.value)}
                  placeholder="Enter your email address (e.g. filler@example.com)"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-black/20 border text-xs font-medium focus:outline-none disabled:opacity-50 transition-colors ${
                    emailCheckStatus === 'exists'
                      ? 'border-red-500 text-red-300 bg-red-500/10'
                      : emailCheckStatus === 'available'
                      ? 'border-emerald-500/50 text-emerald-300 bg-emerald-500/5'
                      : 'border-white/10 focus:border-indigo-500'
                  }`}
                />
                {emailCheckStatus === 'checking' && (
                  <p className="text-[10px] text-indigo-300">Checking submission record for this email...</p>
                )}
                {emailCheckStatus === 'exists' && (
                  <p className="text-[10px] text-red-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{emailCheckMsg}</span>
                  </p>
                )}
                {emailCheckStatus === 'available' && (
                  <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Email verified. No prior response submitted for this form.</span>
                  </p>
                )}
              </div>

              {/* Dynamic Form Questions */}
              {questions.map((q) => {
                const serialKey = String(q.question_serial);
                const currentAns = answersMap[serialKey] || [];
                const isUploading = uploadingFiles[serialKey];

                return (
                  <div key={q.question_serial} className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
                    <label className="block text-xs font-bold leading-5">
                      <span>Q{q.question_serial}. {q.question_statement}</span>
                      {q.is_required && <span className="text-red-400 font-bold ml-1">*</span>}
                    </label>

                    {q.image_url && (
                      <div className="my-2 rounded-xl overflow-hidden border border-white/10 max-h-56 bg-black/30 flex items-center justify-center p-2">
                        <img src={q.image_url} alt={`Question ${q.question_serial} diagram`} className="max-h-52 w-auto object-contain rounded-lg shadow-md" />
                      </div>
                    )}

                    {/* TEXTUAL QUESTION INPUT */}
                    {q.question_type === 'textual' && (
                      <div>
                        {(q.textual_policy?.max_len || 500) > 120 ? (
                          <textarea
                            rows={3}
                            disabled={!form.is_active}
                            value={currentAns[0] || ''}
                            onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                            maxLength={q.textual_policy?.max_len || 500}
                            placeholder="Type your response here..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-medium resize-none disabled:opacity-50"
                          />
                        ) : (
                          <input
                            type="text"
                            disabled={!form.is_active}
                            value={currentAns[0] || ''}
                            onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                            maxLength={q.textual_policy?.max_len || 500}
                            placeholder="Type your answer..."
                            className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-medium disabled:opacity-50"
                          />
                        )}
                        <div className="flex justify-end text-[10px] opacity-60 mt-1">
                          {(currentAns[0] || '').length} / {q.textual_policy?.max_len || 500} chars
                        </div>
                      </div>
                    )}

                    {/* MULTIPLE CHOICE QUESTION INPUT */}
                    {q.question_type === 'multiple_choice' && (
                      <div className="space-y-2 pt-1">
                        {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => {
                          const isSingle = q.multiple_choice_policy?.type === 'Single';
                          const isSelected = isSingle
                            ? currentAns[0] === opt
                            : currentAns.includes(opt);

                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-500/20 border-indigo-500/50 text-white font-bold'
                                  : 'bg-black/20 border-white/10 opacity-80 hover:opacity-100 hover:border-white/20'
                              }`}
                            >
                              <input
                                type={isSingle ? 'radio' : 'checkbox'}
                                disabled={!form.is_active}
                                name={`mc_${q.question_serial}`}
                                checked={isSelected}
                                onChange={() =>
                                  isSingle
                                    ? handleSingleChoice(q.question_serial, opt)
                                    : handleMultipleChoiceToggle(q.question_serial, opt)
                                }
                                className="rounded text-indigo-500"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    )}

                    {/* FILE UPLOAD QUESTION INPUT */}
                    {q.question_type === 'file' && (
                      <div className="space-y-2">
                        {currentAns[0] ? (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                            <div className="flex items-center gap-2 truncate">
                              <FileCheck className="w-4 h-4 shrink-0" />
                              <span className="truncate">{currentAns[0]}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleTextChange(q.question_serial, '')}
                              className="text-[10px] text-red-400 hover:underline shrink-0 ml-2 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="p-4 border-2 border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-black/20">
                            <UploadCloud className="w-6 h-6 mb-1 text-indigo-400" />
                            <span className="text-xs font-semibold">
                              {isUploading ? 'Uploading file to Cloudinary...' : 'Click to select and upload file'}
                            </span>
                            <span className="text-[10px] opacity-60 mt-1">
                              Allowed: {(q.file_policy?.supported_types || []).join(', ') || 'Any'} (Max {q.file_policy?.max_size_mb || 5}MB)
                            </span>
                            <input
                              type="file"
                              disabled={!form.is_active || isUploading}
                              onChange={(e) => handleFileUpload(q.question_serial, e.target.files[0], q.file_policy)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!form.is_active || isSubmitting || emailCheckStatus === 'exists' || Object.values(uploadingFiles).some(Boolean)}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default FormSubmitModal;

import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  FileCheck, 
  Send, 
  Sparkles, 
  Mail, 
  ArrowUpRight, 
  Copy, 
  Check, 
  CreditCard, 
  ExternalLink, 
  Image as ImageIcon, 
  Loader2,
  ShoppingCart,
  ReceiptText
} from 'lucide-react';
import { uploadToCloudinary, formsApi } from '../services/api';

export function FormSubmitModal({ isOpen, form, onClose, onSubmitResponse }) {
  const [answersMap, setAnswersMap] = useState({});
  const [checkoutSelections, setCheckoutSelections] = useState({}); // { serialKey: Set<itemIdx> }
  const [fillerEmail, setFillerEmail] = useState('');
  const [emailCheckStatus, setEmailCheckStatus] = useState(null); // null | 'checking' | 'exists' | 'available'
  const [emailCheckMsg, setEmailCheckMsg] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn('Failed to copy link:', err);
    }
  };

  useEffect(() => {
    if (form && Array.isArray(form.questions)) {
      const initialMap = {};
      const initialSelections = {};
      form.questions.forEach((q) => {
        initialMap[String(q.question_serial)] = [];
        if (q.question_type === 'payment_checkout') {
          initialSelections[String(q.question_serial)] = new Set();
        }
      });
      setAnswersMap(initialMap);
      setCheckoutSelections(initialSelections);
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

  // Payment Screenshot Upload to Cloudinary handler
  const handlePaymentScreenshotUpload = async (serial, file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(`Screenshot "${file.name}" exceeds maximum allowed size of 10MB.`);
      return;
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop().toLowerCase() : '';
    const allowedExts = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
    if (!allowedExts.includes(ext)) {
      setErrorMsg(`Payment screenshot must be an image or document (allowed: ${allowedExts.join(', ')}).`);
      return;
    }

    try {
      setErrorMsg('');
      setUploadingFiles((prev) => ({ ...prev, [String(serial)]: true }));
      const cloudinaryUrl = await uploadToCloudinary(file, 'form_payments', 'image');

      setAnswersMap((prev) => ({
        ...prev,
        [String(serial)]: [cloudinaryUrl],
      }));
    } catch (err) {
      console.error('[FormSubmitModal] Payment screenshot upload error:', err);
      setErrorMsg(err.message || 'Payment screenshot upload failed. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [String(serial)]: false }));
    }
  };

  // Checkout item toggle handler (client-side selection tracking)
  const handleCheckoutItemToggle = (serial, itemIdx) => {
    setCheckoutSelections((prev) => {
      const serialKey = String(serial);
      const current = new Set(prev[serialKey] || []);
      if (current.has(itemIdx)) {
        current.delete(itemIdx);
      } else {
        current.add(itemIdx);
      }
      return { ...prev, [serialKey]: current };
    });
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
              <h2 className="text-lg font-extrabold text-black dark:text-white tracking-tight">
                <span className="classic-dotted-heading">{form.title}</span>
              </h2>
              <p className="text-xs text-black/70 dark:text-slate-300">Fill out and submit form response</p>
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
          <div className="py-8 text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center animate-bounce shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-300">Response Successfully Recorded!</h3>
              <p className="text-xs opacity-80 max-w-md mx-auto mt-1">
                Thank you for filling out &quot;{form.title}&quot;. Your response has been securely logged into the ACES Forms Engine for <span className="font-semibold text-emerald-400">{fillerEmail}</span>.
              </p>
            </div>

            {/* Optional WhatsApp Group & QR Code Box */}
            {(form?.whatsapp_group_link || form?.whatsapp_qr_code) && (
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-emerald-500/30 max-w-md mx-auto space-y-4 text-left shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84s-3.64 2.4-5.82 2.4c-1.43 0-2.83-.37-4.08-1.07l-.29-.17-3.04.8 1.15-2.95-.19-.31c-.76-1.25-1.16-2.69-1.16-4.17 0-4.54 3.7-8.24 8.24-8.24zm4.56 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Join Event WhatsApp Group</h4>
                    <p className="text-[11px] opacity-70">
                      Stay connected for announcements and schedule updates.
                    </p>
                  </div>
                </div>

                {/* QR Code (if provided) */}
                {form.whatsapp_qr_code && (
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="p-2 bg-white rounded-xl shadow-md border border-emerald-500/30">
                      <img
                        src={form.whatsapp_qr_code}
                        alt="WhatsApp Group QR Code"
                        className="w-36 h-36 object-contain rounded"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono mt-1.5">
                      Scan QR code to join group
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                {form.whatsapp_group_link && (
                  <div className="space-y-2 pt-1">
                    <a
                      href={form.whatsapp_group_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Join WhatsApp Group</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(form.whatsapp_group_link)}
                      className="w-full py-1.5 px-3 rounded-xl border border-white/10 hover:border-emerald-500/40 bg-black/20 text-[11px] font-mono flex items-center justify-center gap-1.5 text-white/80 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy WhatsApp Link</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
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

                    {/* PAYMENT ACCEPTANCE QUESTION INPUT */}
                    {q.question_type === 'payment_acceptance' && (
                      <div className="space-y-4">
                        {/* Payment Amount Card */}
                        <div className="p-4 rounded-xl bg-[#9d4edd]/10 border border-[#9d4edd]/30 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#9d4edd]/20 text-[#9d4edd] flex items-center justify-center">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-[#c77dff]">Amount Due</p>
                              <p className="text-[10px] opacity-70">Scan QR and transfer the exact fee</p>
                            </div>
                          </div>
                          <span className="text-lg font-mono font-extrabold text-emerald-400">
                            ₹{q.payment_policy?.amount || '0'}
                          </span>
                        </div>

                        {/* QR Codes Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Primary QR */}
                          {q.payment_policy?.primary_qr_url && (
                            <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 text-center space-y-2">
                              <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                Primary Payment QR
                              </span>
                              <div className="w-36 h-36 mx-auto rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                                <img
                                  src={q.payment_policy.primary_qr_url}
                                  alt="Primary Payment QR"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <a
                                href={q.payment_policy.primary_qr_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 underline"
                              >
                                <span>Open Full QR</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {/* Fallback QR */}
                          {q.payment_policy?.fallback_qr_url && (
                            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 text-center space-y-2">
                              <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                Secondary / Fallback QR
                              </span>
                              <div className="w-36 h-36 mx-auto rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                                <img
                                  src={q.payment_policy.fallback_qr_url}
                                  alt="Fallback Payment QR"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <a
                                href={q.payment_policy.fallback_qr_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 underline"
                              >
                                <span>Open Full QR</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Payment Screenshot Upload Zone */}
                        <div className="space-y-1.5 pt-1">
                          <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Upload Payment Screenshot</span>
                              {q.is_required && <span className="text-red-400">*</span>}
                            </span>
                            <span className="text-[10px] opacity-60">PNG, JPG, WEBP, PDF (Max 10MB)</span>
                          </label>

                          {currentAns[0] ? (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                              <div className="flex items-center gap-2 truncate pr-2">
                                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="truncate">{currentAns[0]}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <label className="text-[11px] text-indigo-300 hover:text-white font-bold cursor-pointer hover:underline">
                                  <span>Replace</span>
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    disabled={!form.is_active || isUploading}
                                    onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleTextChange(q.question_serial, '')}
                                  className="text-[11px] text-red-400 hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="p-4 border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-indigo-500/5 hover:bg-indigo-500/10">
                              {isUploading ? (
                                <div className="flex items-center gap-2 py-2 text-indigo-300">
                                  <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                  <span className="text-xs font-semibold">Uploading payment screenshot...</span>
                                </div>
                              ) : (
                                <>
                                  <UploadCloud className="w-6 h-6 mb-1 text-indigo-400" />
                                  <span className="text-xs font-semibold text-slate-200">
                                    Click or drop to upload payment confirmation screenshot
                                  </span>
                                  <span className="text-[10px] opacity-60 mt-0.5">
                                    Capture the transaction ID &amp; status screen from your payment app
                                  </span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*,application/pdf"
                                disabled={!form.is_active || isUploading}
                                onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    {/* PAYMENT CHECKOUT QUESTION INPUT */}
                    {q.question_type === 'payment_checkout' && (() => {
                      const checkoutPolicy = q.payment_checkout_policy || { items: [], primary_qr_url: '', fallback_qr_url: '' };
                      const checkoutItems = checkoutPolicy.items || [];
                      const selectedSet = checkoutSelections[serialKey] || new Set();
                      const selectedItems = checkoutItems.filter((_, i) => selectedSet.has(i));
                      const totalDue = selectedItems.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);

                      return (
                        <div className="space-y-4">

                          {/* Selectable Items */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 mb-2">
                              <ShoppingCart className="w-4 h-4 text-violet-400" />
                              <span className="text-xs font-bold text-violet-300">Select Items to Pay For</span>
                              {q.is_required && <span className="text-red-400 text-xs">*</span>}
                            </div>

                            {checkoutItems.length === 0 && (
                              <p className="text-[11px] text-violet-400/60 text-center py-3">No checkout items configured.</p>
                            )}

                            {checkoutItems.map((item, itemIdx) => {
                              const isSelected = selectedSet.has(itemIdx);
                              return (
                                <label
                                  key={itemIdx}
                                  className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-violet-500/20 border-violet-500/50 text-white'
                                      : 'bg-black/20 border-white/10 opacity-80 hover:opacity-100 hover:border-violet-400/30'
                                  } ${!form.is_active ? 'cursor-not-allowed opacity-50' : ''}`}
                                >
                                  <div className="flex items-center gap-2.5">
                                    <input
                                      type="checkbox"
                                      disabled={!form.is_active}
                                      checked={isSelected}
                                      onChange={() => handleCheckoutItemToggle(q.question_serial, itemIdx)}
                                      className="rounded text-violet-500 w-3.5 h-3.5"
                                    />
                                    <span className={isSelected ? 'font-bold text-white' : ''}>{item.title}</span>
                                  </div>
                                  <span className={`font-mono font-bold shrink-0 ${
                                    isSelected ? 'text-emerald-400' : 'text-slate-400'
                                  }`}>
                                    ₹{Number(item.cost) || 0}
                                  </span>
                                </label>
                              );
                            })}
                          </div>

                          {/* Billing Summary Card */}
                          <div className={`p-4 rounded-xl border transition-all ${
                            selectedItems.length > 0
                              ? 'bg-violet-500/10 border-violet-500/40'
                              : 'bg-black/20 border-white/10 opacity-60'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <ReceiptText className="w-3.5 h-3.5 text-violet-400" />
                              <span className="text-[11px] font-bold text-violet-300">Billing Summary</span>
                            </div>
                            {selectedItems.length === 0 ? (
                              <p className="text-[11px] text-slate-400">No items selected yet.</p>
                            ) : (
                              <div className="space-y-1">
                                {selectedItems.map((item, i) => (
                                  <div key={i} className="flex items-center justify-between text-[11px]">
                                    <span className="text-slate-300">{item.title}</span>
                                    <span className="font-mono text-emerald-400 font-bold">₹{Number(item.cost) || 0}</span>
                                  </div>
                                ))}
                                <div className="flex items-center justify-between pt-2 mt-1 border-t border-white/10">
                                  <span className="text-xs font-bold text-white">Total Due</span>
                                  <span className="text-base font-mono font-extrabold text-emerald-400">₹{totalDue}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* QR Codes Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {/* Primary QR */}
                            {checkoutPolicy.primary_qr_url && (
                              <div className="p-3.5 rounded-xl bg-black/40 border border-emerald-500/30 text-center space-y-2">
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  Primary Payment QR
                                </span>
                                <div className="w-36 h-36 mx-auto rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                                  <img
                                    src={checkoutPolicy.primary_qr_url}
                                    alt="Primary Payment QR"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <a
                                  href={checkoutPolicy.primary_qr_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 underline"
                                >
                                  <span>Open Full QR</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {/* Fallback QR */}
                            {checkoutPolicy.fallback_qr_url && (
                              <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/30 text-center space-y-2">
                                <span className="inline-block px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                                  Secondary / Fallback QR
                                </span>
                                <div className="w-36 h-36 mx-auto rounded-xl bg-white p-2 flex items-center justify-center shadow-lg">
                                  <img
                                    src={checkoutPolicy.fallback_qr_url}
                                    alt="Fallback Payment QR"
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <a
                                  href={checkoutPolicy.fallback_qr_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] text-indigo-300 hover:text-indigo-200 underline"
                                >
                                  <span>Open Full QR</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* Payment Screenshot Upload Zone */}
                          <div className="space-y-1.5 pt-1">
                            <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5 text-violet-400" />
                                <span>Upload Payment Screenshot</span>
                                {q.is_required && <span className="text-red-400">*</span>}
                              </span>
                              <span className="text-[10px] opacity-60">PNG, JPG, WEBP, PDF (Max 10MB)</span>
                            </label>

                            {currentAns[0] ? (
                              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-semibold">
                                <div className="flex items-center gap-2 truncate pr-2">
                                  <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                  <span className="truncate">{currentAns[0]}</span>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                  <label className="text-[11px] text-indigo-300 hover:text-white font-bold cursor-pointer hover:underline">
                                    <span>Replace</span>
                                    <input
                                      type="file"
                                      accept="image/*,application/pdf"
                                      disabled={!form.is_active || isUploading}
                                      onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                                      className="hidden"
                                    />
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => handleTextChange(q.question_serial, '')}
                                    className="text-[11px] text-red-400 hover:underline cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="p-4 border-2 border-dashed border-violet-500/40 hover:border-violet-400 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-violet-500/5 hover:bg-violet-500/10">
                                {isUploading ? (
                                  <div className="flex items-center gap-2 py-2 text-violet-300">
                                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                                    <span className="text-xs font-semibold">Uploading payment screenshot...</span>
                                  </div>
                                ) : (
                                  <>
                                    <UploadCloud className="w-6 h-6 mb-1 text-violet-400" />
                                    <span className="text-xs font-semibold text-slate-200">
                                      Click or drop to upload payment confirmation screenshot
                                    </span>
                                    <span className="text-[10px] opacity-60 mt-0.5">
                                      Capture the transaction ID &amp; status screen from your payment app
                                    </span>
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  disabled={!form.is_active || isUploading}
                                  onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })()}
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

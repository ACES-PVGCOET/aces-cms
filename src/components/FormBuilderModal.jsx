import { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  GripVertical, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  FileText, 
  ListOrdered, 
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2,
  FileCheck
} from 'lucide-react';
import { uploadToCloudinary } from '../services/api';

const DEFAULT_QUESTIONS = [
  {
    question_serial: 1,
    question_statement: 'Email Address',
    question_type: 'textual',
    is_required: true,
    image_url: '',
    textual_policy: { max_len: 100 },
    multiple_choice_policy: { type: 'Single', options: [] },
    file_policy: { supported_types: ['pdf', 'png', 'jpg'], max_size_mb: 5 },
  },
  {
    question_serial: 2,
    question_statement: 'Phone Number',
    question_type: 'textual',
    is_required: false,
    image_url: '',
    textual_policy: { max_len: 20 },
    multiple_choice_policy: { type: 'Single', options: [] },
    file_policy: { supported_types: ['pdf', 'png', 'jpg'], max_size_mb: 5 },
  },
];

export function FormBuilderModal({ isOpen, initialForm, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState({});

  useEffect(() => {
    if (initialForm) {
      setTitle(initialForm.title || '');
      setDescription(initialForm.description || '');
      setIsActive(initialForm.is_active !== undefined ? Boolean(initialForm.is_active) : true);

      if (Array.isArray(initialForm.questions) && initialForm.questions.length > 0) {
        setQuestions(
          initialForm.questions.map((q, idx) => ({
            question_serial: q.question_serial || idx + 1,
            question_statement: q.question_statement || '',
            question_type: q.question_type || 'textual',
            is_required: q.is_required !== undefined ? Boolean(q.is_required) : true,
            image_url: q.image_url || '',
            textual_policy: q.textual_policy || { max_len: 500 },
            multiple_choice_policy: q.multiple_choice_policy || { type: 'Single', options: ['Option 1', 'Option 2'] },
            file_policy: q.file_policy || { supported_types: ['pdf', 'png', 'jpg'], max_size_mb: 5 },
          }))
        );
      } else {
        setQuestions(DEFAULT_QUESTIONS);
      }
    } else {
      setTitle('');
      setDescription('');
      setIsActive(true);
      setQuestions(DEFAULT_QUESTIONS);
    }
    setErrorMsg('');
    setIsPreviewMode(false);
    setUploadingImages({});
  }, [initialForm, isOpen]);

  if (!isOpen) return null;

  // Re-index question serial numbers
  const reindexQuestions = (list) => {
    return list.map((q, idx) => ({
      ...q,
      question_serial: idx + 1,
    }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (idx) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;

    const updated = [...questions];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(idx, 0, item);
    setQuestions(reindexQuestions(updated));
    setDraggedIndex(idx);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Move up/down handlers
  const moveQuestion = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const updated = [...questions];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setQuestions(reindexQuestions(updated));
  };

  // Add question
  const handleAddQuestion = () => {
    const newQ = {
      question_serial: questions.length + 1,
      question_statement: '',
      question_type: 'textual',
      is_required: true,
      image_url: '',
      textual_policy: { max_len: 500 },
      multiple_choice_policy: { type: 'Single', options: ['Option 1', 'Option 2'] },
      file_policy: { supported_types: ['pdf', 'png', 'jpg'], max_size_mb: 5 },
    };
    setQuestions([...questions, newQ]);
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    if (questions.length <= 1) {
      setErrorMsg('Form must contain at least one question.');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx);
    setQuestions(reindexQuestions(updated));
  };

  // Update question field
  const updateQuestionField = (idx, field, value) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  // Upload Question Body Image to Cloudinary
  const handleImageUpload = async (idx, file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg(`Image file "${file.name}" exceeds maximum size of 5MB.`);
      return;
    }

    try {
      setErrorMsg('');
      setUploadingImages((prev) => ({ ...prev, [idx]: true }));
      const uploadedUrl = await uploadToCloudinary(file, 'form_questions', 'image');
      updateQuestionField(idx, 'image_url', uploadedUrl);
    } catch (err) {
      console.error('[FormBuilderModal] Question image upload failed:', err);
      setErrorMsg(err.message || 'Question image upload failed. Please try again.');
    } finally {
      setUploadingImages((prev) => ({ ...prev, [idx]: false }));
    }
  };

  // Update question policy object
  const updateQuestionPolicy = (idx, policyKey, field, value) => {
    const updated = [...questions];
    updated[idx] = {
      ...updated[idx],
      [policyKey]: {
        ...updated[idx][policyKey],
        [field]: value,
      },
    };
    setQuestions(updated);
  };

  // Add Multiple Choice Option
  const handleAddOption = (qIdx) => {
    const q = questions[qIdx];
    const currentOpts = q.multiple_choice_policy?.options || [];
    const newOpts = [...currentOpts, `Option ${currentOpts.length + 1}`];
    updateQuestionPolicy(qIdx, 'multiple_choice_policy', 'options', newOpts);
  };

  // Edit Option Text
  const handleOptionChange = (qIdx, optIdx, text) => {
    const q = questions[qIdx];
    const currentOpts = [...(q.multiple_choice_policy?.options || [])];
    currentOpts[optIdx] = text;
    updateQuestionPolicy(qIdx, 'multiple_choice_policy', 'options', currentOpts);
  };

  // Remove Option
  const handleRemoveOption = (qIdx, optIdx) => {
    const q = questions[qIdx];
    const currentOpts = (q.multiple_choice_policy?.options || []).filter((_, i) => i !== optIdx);
    updateQuestionPolicy(qIdx, 'multiple_choice_policy', 'options', currentOpts);
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Object.values(uploadingImages).some(Boolean)) {
      setErrorMsg('Please wait for question image upload to finish before saving form.');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Form title is required.');
      return;
    }

    if (questions.length === 0) {
      setErrorMsg('At least one question is required.');
      return;
    }

    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_statement.trim()) {
        setErrorMsg(`Question #${q.question_serial} statement cannot be empty.`);
        return;
      }
      if (q.question_type === 'multiple_choice') {
        const opts = q.multiple_choice_policy?.options || [];
        if (opts.length === 0 || opts.some((o) => !o.trim())) {
          setErrorMsg(`Question #${q.question_serial} must have valid non-empty options.`);
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: title.trim(),
        description: description.trim(),
        is_active: isActive,
        questions: questions.map((q, idx) => ({
          question_serial: idx + 1,
          question_statement: q.question_statement.trim(),
          question_type: q.question_type,
          is_required: Boolean(q.is_required),
          image_url: q.image_url ? q.image_url.trim() : '',
          textual_policy: q.textual_policy || { max_len: 500 },
          multiple_choice_policy: q.multiple_choice_policy || { type: 'Single', options: [] },
          file_policy: q.file_policy || { supported_types: ['pdf'], max_size_mb: 5 },
        })),
      };

      await onSubmit(payload);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save form. Check inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl my-8 overflow-hidden text-slate-100 border border-white/20">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {initialForm ? 'Edit Custom Form' : 'Create Custom Form'}
              </h2>
              <p className="text-xs opacity-70">
                Design custom questions, set input policies & configure form availability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Preview Toggle */}
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isPreviewMode ? 'bg-indigo-600 text-white shadow-lg' : 'btn-secondary'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{isPreviewMode ? 'Back to Editor' : 'Live Preview'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* LIVE PREVIEW MODE */}
        {isPreviewMode ? (
          <div className="space-y-6 bg-black/20 p-6 rounded-2xl border border-white/10 max-h-[65vh] overflow-y-auto">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-indigo-300">{title || 'Untitled Form'}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {isActive ? 'Active Form' : 'Inactive Form'}
                </span>
              </div>
              <p className="text-xs opacity-80">{description || 'No description provided.'}</p>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl glass-panel space-y-3">
                  <label className="block text-xs font-bold leading-5">
                    <span>Q{q.question_serial}: {q.question_statement || 'Question Prompt'}</span>
                    {q.is_required && <span className="text-red-400 font-bold ml-1">*</span>}
                  </label>

                  {q.image_url && (
                    <div className="my-2 rounded-xl overflow-hidden border border-white/10 max-h-48 bg-black/40">
                      <img src={q.image_url} alt={`Question ${q.question_serial} body`} className="w-full h-full object-contain max-h-48" />
                    </div>
                  )}

                  {q.question_type === 'textual' && (
                    <input
                      type="text"
                      disabled
                      placeholder={`Enter text answer (Max ${q.textual_policy?.max_len || 500} chars)`}
                      className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-xs opacity-60 cursor-not-allowed"
                    />
                  )}

                  {q.question_type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2 text-xs opacity-80 cursor-not-allowed">
                          <input
                            type={q.multiple_choice_policy?.type === 'Single' ? 'radio' : 'checkbox'}
                            disabled
                            className="rounded text-indigo-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {q.question_type === 'file' && (
                    <div className="p-4 border-2 border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-center opacity-60">
                      <UploadCloud className="w-6 h-6 mb-1 opacity-70" />
                      <span className="text-xs font-semibold">File Upload Input Placeholder</span>
                      <span className="text-[10px] opacity-70">
                        Allowed: {(q.file_policy?.supported_types || []).join(', ') || 'Any'} (Max {q.file_policy?.max_size_mb || 5}MB)
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* FORM EDITOR MODE */
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold opacity-80">Form Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. ACES Hackathon Registration 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold opacity-80">Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isActive ? 'Active (Accepting)' : 'Inactive (Closed)'}</span>
                </button>
              </div>

              <div className="sm:col-span-3 space-y-1.5">
                <label className="block text-xs font-bold opacity-80">Form Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Briefly explain what this form is for and any instructions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-medium resize-none"
                />
              </div>
            </div>

            {/* Questions Section Header */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>Form Questions ({questions.length})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 opacity-70">
                  Drag handles to reorder
                </span>
              </h3>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            {/* Questions List (Drag & Drop + Cards) */}
            <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`p-4 rounded-2xl glass-panel transition-all border ${
                    draggedIndex === idx
                      ? 'border-indigo-500 bg-indigo-500/10 scale-[0.99]'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    
                    {/* Drag Handle & Reorder controls */}
                    <div className="flex flex-col items-center gap-1 pt-1 opacity-60 hover:opacity-100 shrink-0">
                      <div className="cursor-grab active:cursor-grabbing p-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveQuestion(idx, 'up')}
                        className="p-0.5 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === questions.length - 1}
                        onClick={() => moveQuestion(idx, 'down')}
                        className="p-0.5 rounded hover:bg-white/10 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 space-y-3 min-w-0">
                      
                      {/* Top Row: Serial, Statement, Type Selector */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {q.question_serial}
                        </span>

                        <input
                          type="text"
                          required
                          value={q.question_statement}
                          onChange={(e) => updateQuestionField(idx, 'question_statement', e.target.value)}
                          placeholder="Question prompt/statement (e.g. Select your domain track)"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 focus:border-indigo-500 focus:outline-none text-xs font-semibold"
                        />

                        {/* Type Selector */}
                        <select
                          value={q.question_type}
                          onChange={(e) => updateQuestionField(idx, 'question_type', e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="textual" className="bg-slate-900 text-white">Textual Answer</option>
                          <option value="multiple_choice" className="bg-slate-900 text-white">Multiple Choice</option>
                          <option value="file" className="bg-slate-900 text-white">File Upload</option>
                        </select>
                      </div>

                      {/* Question Body Image Upload Control */}
                      <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 space-y-2">
                        {q.image_url ? (
                          <div className="flex items-center justify-between gap-3 bg-black/40 p-2 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 shrink-0 bg-black/50">
                                <img src={q.image_url} alt="Question diagram" className="w-full h-full object-cover" />
                              </div>
                              <div className="truncate text-xs">
                                <p className="font-bold text-indigo-300 flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                  <span>Question Image Attached</span>
                                </p>
                                <p className="text-[10px] opacity-60 truncate">{q.image_url}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <label className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 text-[11px] font-bold cursor-pointer transition-colors flex items-center gap-1">
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  disabled={uploadingImages[idx]}
                                  onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => updateQuestionField(idx, 'image_url', '')}
                                className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-[11px] font-bold cursor-pointer transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <label className="flex-1 p-2.5 border border-dashed border-white/20 hover:border-indigo-500/50 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all bg-black/30 hover:bg-indigo-500/10 text-xs">
                              {uploadingImages[idx] ? (
                                <>
                                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                                  <span className="font-semibold text-indigo-300">Uploading Image to Cloudinary...</span>
                                </>
                              ) : (
                                <>
                                  <UploadCloud className="w-4 h-4 text-indigo-400 shrink-0" />
                                  <span className="font-medium text-slate-200">Upload Question Body Image (PNG, JPG, WEBP)</span>
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingImages[idx]}
                                onChange={(e) => handleImageUpload(idx, e.target.files?.[0])}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Middle Row: Policies depending on Question Type */}

                      {/* TEXTUAL POLICY */}
                      {q.question_type === 'textual' && (
                        <div className="flex items-center gap-4 text-xs bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <label className="flex items-center gap-2 opacity-80">
                            <span>Max Length (Chars):</span>
                            <input
                              type="number"
                              min={10}
                              max={2000}
                              value={q.textual_policy?.max_len || 500}
                              onChange={(e) => updateQuestionPolicy(idx, 'textual_policy', 'max_len', parseInt(e.target.value, 10) || 500)}
                              className="w-20 px-2 py-1 rounded bg-black/40 border border-white/10 text-xs text-center font-bold"
                            />
                          </label>
                        </div>
                      )}

                      {/* MULTIPLE CHOICE POLICY */}
                      {q.question_type === 'multiple_choice' && (
                        <div className="space-y-2 bg-black/20 p-3 rounded-xl border border-white/5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs">
                              <span className="font-bold opacity-80">Choice Mode:</span>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`mc_type_${idx}`}
                                  checked={q.multiple_choice_policy?.type === 'Single'}
                                  onChange={() => updateQuestionPolicy(idx, 'multiple_choice_policy', 'type', 'Single')}
                                />
                                <span>Single (Radio)</span>
                              </label>
                              <label className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="radio"
                                  name={`mc_type_${idx}`}
                                  checked={q.multiple_choice_policy?.type === 'Multiple'}
                                  onChange={() => updateQuestionPolicy(idx, 'multiple_choice_policy', 'type', 'Multiple')}
                                />
                                <span>Multiple (Checkbox)</span>
                              </label>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleAddOption(idx)}
                              className="px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-[10px] font-bold hover:bg-indigo-500/30 transition-colors"
                            >
                              + Add Option
                            </button>
                          </div>

                          <div className="space-y-1.5 pt-1">
                            {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => (
                              <div key={oIdx} className="flex items-center gap-2">
                                <span className="text-[10px] opacity-60 w-4">{oIdx + 1}.</span>
                                <input
                                  type="text"
                                  required
                                  value={opt}
                                  onChange={(e) => handleOptionChange(idx, oIdx, e.target.value)}
                                  placeholder={`Option ${oIdx + 1}`}
                                  className="flex-1 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-xs font-medium focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOption(idx, oIdx)}
                                  className="p-1 text-red-400 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FILE POLICY */}
                      {q.question_type === 'file' && (
                        <div className="flex flex-wrap items-center gap-4 text-xs bg-black/20 p-2.5 rounded-xl border border-white/5">
                          <label className="flex items-center gap-2 opacity-80">
                            <span>Allowed File Exts (comma separated):</span>
                            <input
                              type="text"
                              value={(q.file_policy?.supported_types || []).join(', ')}
                              onChange={(e) =>
                                updateQuestionPolicy(
                                  idx,
                                  'file_policy',
                                  'supported_types',
                                  e.target.value.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
                                )
                              }
                              placeholder="pdf, png, jpg, zip"
                              className="w-36 px-2 py-1 rounded bg-black/40 border border-white/10 text-xs font-medium"
                            />
                          </label>

                          <label className="flex items-center gap-2 opacity-80">
                            <span>Max Size (MB):</span>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={q.file_policy?.max_size_mb || 5}
                              onChange={(e) => updateQuestionPolicy(idx, 'file_policy', 'max_size_mb', parseInt(e.target.value, 10) || 5)}
                              className="w-16 px-2 py-1 rounded bg-black/40 border border-white/10 text-xs text-center font-bold"
                            />
                          </label>
                        </div>
                      )}

                      {/* Bottom Row: Mandatory Checkbox & Remove Question */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer font-semibold opacity-90">
                          <input
                            type="checkbox"
                            checked={q.is_required}
                            onChange={(e) => updateQuestionField(idx, 'is_required', e.target.checked)}
                            className="rounded text-indigo-500"
                          />
                          <span>Mandatory Field (Required answer)</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="flex items-center gap-1 text-red-400 opacity-70 hover:opacity-100 transition-opacity font-medium cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Actions */}
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
                disabled={isSubmitting}
                className="btn-primary px-6 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Form...</span>
                  </>
                ) : (
                  <span>{initialForm ? 'Update Form' : 'Publish Custom Form'}</span>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

export default FormBuilderModal;

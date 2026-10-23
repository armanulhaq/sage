'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  X,
  User,
  Globe,
  Lock,
  Loader2,
  Image as ImageIcon,
  BookOpen,
  UploadCloud,
} from 'lucide-react';
import { api } from '@/utils/api';
import type { PersonalityResponse } from 'contract';

type FormValues = {
  name: string;
  bio: string;
  avatar: string;
  voiceTone: string;
  isPublic: boolean;
};

interface CreatePersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (personality: PersonalityResponse) => void;
}

export default function CreatePersonalityModal({
  isOpen,
  onClose,
  onCreated,
}: CreatePersonalityModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'sources'>('profile');
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      bio: '',
      avatar: '',
      voiceTone: '',
      isPublic: false,
    },
  });

  const avatarUrl = watch('avatar');
  const isPublic = watch('isPublic');

  if (!isOpen) return null;

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      const res = await api.personality.create({
        body: {
          name: data.name.trim(),
          bio: data.bio.trim(),
          avatar: data.avatar.trim() || null,
          voiceTone: data.voiceTone.trim() || null,
          isPublic: data.isPublic,
        },
      });

      if (res.status === 201) {
        reset();
        setActiveTab('profile');
        onCreated(res.body);
        onClose();
      } else {
        const body = res.body as any;
        const msg =
          body?.message ||
          body?.bodyResult?.issues?.[0]?.message ||
          'Failed to create sage';
        setServerError(String(msg));
      }
    } catch (err: any) {
      console.error('Create sage error:', err);
      setServerError('Unable to connect to the server');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#111218] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/60 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Create New Sage</h2>
              <p className="text-xs text-stone-400">Bring a thinker or historic figure to life</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-stone-950/40 px-6 pt-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Persona</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sources')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'sources'
                ? 'border-red-500 text-red-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Sources</span>
            <span className="text-[10px] text-stone-500 font-normal">(Next Step)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          {serverError && (
            <div className="p-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              {serverError}
            </div>
          )}

          {activeTab === 'profile' ? (
            <>
              {/* Name & Avatar Preview */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl border border-stone-800 bg-stone-950 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-7 h-7 text-stone-600" />
                    )}
                  </div>
                  <span className="block text-[10px] text-stone-500 text-center mt-1">Preview</span>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jawaharlal Nehru"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Minimum 2 characters' },
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-300 mb-1 flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-stone-400" />
                      <span>Avatar Image URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      {...register('avatar')}
                      className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Biography & Background <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe their life, philosophical depth, and major historical achievements..."
                  {...register('bio', {
                    required: 'Biography is required',
                    minLength: { value: 10, message: 'Minimum 10 characters' },
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 resize-none font-serif-quote"
                />
                {errors.bio && (
                  <p className="text-[11px] text-red-400 mt-1">{errors.bio.message}</p>
                )}
              </div>

              {/* Voice & Tone Hint */}
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Voice & Tone Nuance <span className="text-stone-500 text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Contemplative, poetic, secular, eloquent, introspective"
                  {...register('voiceTone')}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  How the AI should speak when adopting this persona.
                </p>
              </div>

              {/* Visibility Switch */}
              <div className="p-3.5 rounded-xl border border-stone-800 bg-stone-950/70 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-400 mt-0.5">
                    {isPublic ? (
                      <Globe className="w-4 h-4 text-red-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {isPublic ? 'Public Sage (Community)' : 'Private Sage'}
                    </span>
                    <span className="text-[11px] text-stone-400 block leading-relaxed">
                      {isPublic
                        ? 'Submits this sage for community listing so other users can converse with them.'
                        : 'Only you can see and converse with this sage.'}
                    </span>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    {...register('isPublic')}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-700"></div>
                </label>
              </div>
            </>
          ) : (
            /* Sources Tab Placeholder */
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-950 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-sm font-semibold text-white mb-1">
                  Knowledge & Document Upload
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Coming next! You will be able to upload full PDFs, speeches, and articles with automatic text extraction and vector chunking.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-stone-800 bg-stone-950/60 text-[11px] text-stone-400 inline-block">
                You can create this sage profile now and attach sources anytime later.
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-red-950/40"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{isSubmitting ? 'Creating...' : 'Create Sage'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

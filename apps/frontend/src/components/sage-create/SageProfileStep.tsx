'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import {
  User,
  Upload,
  Trash2,
  Check,
  Loader2,
  Globe,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { api } from '@/utils/api';
import { uploadFile } from '@/utils/upload';
import type { PersonalityResponse } from 'contract';

export type ProfileFormValues = {
  name: string;
  bio: string;
  avatar: string;
  voiceTone: string;
  isPublic: boolean;
};

interface SageProfileStepProps {
  onSuccess?: (personality: PersonalityResponse) => void;
  onGoToKnowledge?: () => void;
}

export default function SageProfileStep({
  onSuccess,
  onGoToKnowledge,
}: SageProfileStepProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const fileUrl = await uploadFile(file, 'avatars');
      setValue('avatar', fileUrl, { shouldValidate: true });
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      setUploadError(err.message || 'Failed to upload image to S3');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
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
        if (onSuccess) {
          onSuccess(res.body);
        } else {
          router.push('/sages');
        }
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
      {serverError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {serverError}
        </div>
      )}

      {/* 1. Sage Portrait Section (File upload only) */}
      <div className="p-6 rounded-2xl border border-stone-800/80 bg-[#111218]/70 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Sage Portrait</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Upload a portrait of this thinker or historical figure (stored in AWS S3).
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
          {/* Avatar Preview Box */}
          <div className="relative w-24 h-24 rounded-2xl border-2 border-dashed border-stone-800 bg-stone-950 flex-shrink-0 overflow-hidden flex items-center justify-center group">
            {avatarUrl ? (
              <>
                <img
                  src={avatarUrl}
                  alt="Portrait preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setValue('avatar', '')}
                  title="Remove image"
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            ) : isUploading ? (
              <div className="flex flex-col items-center gap-1.5 text-red-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-[10px] text-stone-400">Uploading</span>
              </div>
            ) : (
              <User className="w-10 h-10 text-stone-700" />
            )}
          </div>

          {/* Upload Button & Guidance */}
          <div className="flex-1 space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              onChange={handleImageFileChange}
              className="hidden"
              id="sage-portrait-file"
              disabled={isUploading || isSubmitting}
            />

            <div className="flex items-center gap-2.5">
              <label
                htmlFor="sage-portrait-file"
                className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all inline-flex items-center gap-2 ${
                  isUploading
                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 hover:border-stone-600 shadow-sm'
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                    <span>Uploading to AWS S3...</span>
                  </>
                ) : avatarUrl ? (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </>
                )}
              </label>

              {avatarUrl && !isUploading && (
                <button
                  type="button"
                  onClick={() => setValue('avatar', '')}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-400 hover:bg-stone-900 border border-transparent hover:border-stone-800 transition-colors"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-[11px] text-stone-400">
              {avatarUrl ? (
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5 inline" />
                  Image successfully uploaded to AWS S3
                </span>
              ) : (
                'Supports PNG, JPG, or WebP up to 5MB.'
              )}
            </p>

            {uploadError && (
              <p className="text-xs text-red-400 font-medium">{uploadError}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Basic Identity Details */}
      <div className="p-6 rounded-2xl border border-stone-800/80 bg-[#111218]/70 space-y-5">
        <h3 className="text-sm font-semibold text-white">Identity & Voice</h3>

        <div>
          <label className="block text-xs font-medium text-stone-300 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Marcus Aurelius, Jawaharlal Nehru, Simone de Beauvoir"
            {...register('name', {
              required: 'Name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
            })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors"
          />
          {errors.name && (
            <p className="text-[11px] text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-300 mb-1.5">
            Biography & Philosophical Stance <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe their life, worldview, major historical context, and core principles..."
            {...register('bio', {
              required: 'Biography is required',
              minLength: { value: 10, message: 'Minimum 10 characters' },
            })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors resize-none font-serif-quote"
          />
          {errors.bio && (
            <p className="text-[11px] text-red-400 mt-1">{errors.bio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center justify-between">
            <span>Voice & Tone Nuance</span>
            <span className="text-stone-500 text-[11px] font-normal">Optional</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Stoic, introspective, contemplative, poetic, analytical, secular"
            {...register('voiceTone')}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-white text-xs placeholder-stone-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-colors"
          />
          <p className="text-[11px] text-stone-500 mt-1.5">
            Dictates how the AI crafts responses while speaking as this historical thinker.
          </p>
        </div>
      </div>

      {/* 3. Catalog Visibility */}
      <div className="p-5 rounded-2xl border border-stone-800/80 bg-[#111218]/70 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-400 mt-0.5">
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
            <span className="text-[11px] text-stone-400 block leading-relaxed mt-0.5">
              {isPublic
                ? 'Submits this sage to the public catalog so other users can explore and converse with them.'
                : 'Only you can view and dialogue with this sage.'}
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input
            type="checkbox"
            {...register('isPublic')}
            className="sr-only peer"
          />
          <div className="w-10 h-6 bg-stone-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-700"></div>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
        <button
          type="button"
          onClick={() => router.push('/sages')}
          disabled={isSubmitting || isUploading}
          className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-900 transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {onGoToKnowledge && (
            <button
              type="button"
              onClick={onGoToKnowledge}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-stone-300 hover:text-white bg-stone-900 border border-stone-800 hover:border-stone-700 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Preview Knowledge Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-600 text-white transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-red-950/40 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Sage...</span>
              </>
            ) : isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Image...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Create Sage</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

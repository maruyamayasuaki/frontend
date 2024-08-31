'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import { fetchVideosWithTags, fetchVideoWithLikesAndComments, uploadVideo } from './action'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export default function Test2() {
  const [error, setError] = useState<string | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<object | null>(null)
  const [videosWithTags, setVideosWithTags] = useState<object[]>([])
  const [videoWithLikesAndComments, setVideoWithLikesAndComments] = useState<object | null>(null)

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError(sessionError.message)
      } else {
        setSession(sessionData.session)
        setUser(sessionData.session?.user ?? null)
      }
    }

    const fetchVideosData = async () => {
      try {
        const tagsData = await fetchVideosWithTags()
        setVideosWithTags(tagsData)

        // 特定のビデオIDを直接指定
        const specificVideoId = 2 // ここで希望のビデオIDを指定
        const likesCommentsData = await fetchVideoWithLikesAndComments(specificVideoId)
        setVideoWithLikesAndComments(likesCommentsData)
      } catch (error) {
        setError((error as Error).message)
      }
    }

    fetchSession()
    fetchVideosData()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <div className='min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8'>
      <h1 className='text-2xl font-bold mb-4'>ユーザー情報</h1>
      {error && <p className='text-red-500 mb-4'>エラー: {error}</p>}
      <div className='mb-8'>
        <h2 className='text-xl font-semibold mb-2'>セッション状態</h2>
        {session ? (
          <p className='text-green-500'>ログイン中</p>
        ) : (
          <p className='text-yellow-500'>未ログイン</p>
        )}
      </div>

      {user ? (
        <div className='mb-8'>
          <h2 className='text-xl font-semibold mb-2'>ログインユーザー</h2>
          <pre className='bg-gray-800 p-4 rounded'>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <p className='mb-8'>ユーザー情報がありません</p>
      )}

      <h2 className='text-xl font-semibold mb-2'>動画一覧画面で使用するデータをフッチ</h2>
      {videosWithTags.length > 0 ? (
        <pre className='bg-gray-800 p-4 rounded'>{JSON.stringify(videosWithTags, null, 2)}</pre>
      ) : (
        <p>ビデオとタグデータを読み込み中...</p>
      )}

      <h2 className='text-xl font-semibold mb-2'>動画視聴画面で使用するデータをフェッチ</h2>
      {videoWithLikesAndComments ? (
        <pre className='bg-gray-800 p-4 rounded'>
          {JSON.stringify(videoWithLikesAndComments, null, 3)}
        </pre>
      ) : (
        <p>ビデオ、いいね、コメントデータを読み込み中...</p>
      )}

      <VideoUploader session={session} />
    </div>
  )
}

interface VideoUploaderProps {
  session: Session | null
}

function VideoUploader({ session }: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file || !session?.user?.id) return

    setUploading(true)
    setUploadError(null)
    setUploadSuccess(false)
    setUploadedVideoUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'アップロードに失敗しました')
      }

      await uploadVideo(result.path, session.user.id)
      setUploadSuccess(true)
      setFile(null)
      setUploadedVideoUrl(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/videos/${result.path}`
      )
    } catch (error) {
      setUploadError((error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='mt-8'>
      <h2 className='text-xl font-semibold mb-4'>動画アップロード</h2>
      <input type='file' accept='video/*' onChange={handleFileChange} className='mb-4' />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50'
      >
        {uploading ? 'アップロード中...' : 'アップロード'}
      </button>
      {uploadError && <p className='text-red-500 mt-2'>{uploadError}</p>}
      {uploadSuccess && <p className='text-green-500 mt-2'>アップロード成功！</p>}
      {uploadedVideoUrl && (
        <div className='mt-4'>
          <h3 className='text-lg font-semibold mb-2'>アップロードされた動画：</h3>
          <video src={uploadedVideoUrl} controls className='w-full max-w-lg mb-2'>
            お使いのブラウザは動画タグをサポートしていません。
          </video>
          <p className='text-sm break-all'>
            <span className='font-semibold'>動画URL：</span> {uploadedVideoUrl}
          </p>
        </div>
      )}
    </div>
  )
}

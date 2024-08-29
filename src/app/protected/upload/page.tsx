'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const UploadForm = dynamic(() => import('@/components/UploadForm'), { ssr: false })
const Preview = dynamic(() => import('@/components/Preview'), { ssr: false })
const Article = dynamic(() => import('@/components/Article'), { ssr: false })

export default function Component() {
  const [formData, setFormData] = useState({
    title: '',
    manimCode: '',
    tags: [] as string[],
    videoFile: null as File | null,
    manimFile: null as File | null,
    description: '',
    algorithmExplanation: '',
    activeTab: 'code',
    references: [] as string[], // 参考文献の配列を追加
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false) // ロード状態を追加

  const handleFormChange = (data: Partial<typeof formData>) => {
    setFormData((prevData) => {
      const newData = { ...prevData, ...data }
      if (newData.videoFile && newData.videoFile !== prevData.videoFile) {
        // 新しい動画ファイルが選択された場合、プレビューURLを更新
        setPreviewUrl(URL.createObjectURL(newData.videoFile))
      }
      return newData
    })
  }

  useEffect(() => {
    // コンポーネントのクリーンアップ時にオブジェクトURLを解放
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFormSubmit = async (data: typeof formData) => {
    setFormData(data)
    setIsLoading(true) // ロード開始
    console.log('Form submitted:', data)
    if (data.manimFile) {
      const formData = new FormData()
      formData.append('file', data.manimFile)
      const response = await fetch('http://localhost:10000/uploadcode/', {
        method: 'POST',
        body: formData,
      })
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
    }
    setIsLoading(false) // ロード終了
  }

  return (
    <div className='min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
        <UploadForm onSubmit={handleFormSubmit} onChange={handleFormChange} />
        <div className='space-y-4'>
          <Preview
            title={formData.title}
            tags={formData.tags}
            description={formData.description}
            previewUrl={previewUrl}
            manimFile={formData.manimFile}
            videoFile={formData.videoFile}
            references={formData.references} // 参考文献を追加
            isLoading={isLoading} // ロード状態を渡す
          />
          <h3 className='text-lg font-semibold mb-2'>アルゴリズム解説</h3>
          <div className='bg-gray-800 p-4 rounded-lg'>
            <Article algorithmData={formData.algorithmExplanation} />
          </div>
        </div>
      </div>
    </div>
  )
}

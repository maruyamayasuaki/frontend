'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Play, Code, Film, File, Video } from 'lucide-react'

export default function Component() {
  const [title, setTitle] = useState('')
  const [manimCode, setManimCode] = useState('')
  const [tags, setTags] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [manimFile, setManimFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('code')

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Converting to video:', { title, manimCode, manimFile, tags })
    // Here you would implement the logic to convert Manim code or file to video
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Uploading video:', { title, videoFile, tags })
  }

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleManimFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setManimFile(file)
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div className='space-y-6'>
          <form
            onSubmit={activeTab === 'video' ? handleUpload : handleConvert}
            className='space-y-6'
          >
            <div className='space-y-2'>
              <Label htmlFor='title' className='text-lg'>
                タイトル
              </Label>
              <Input
                id='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full bg-gray-800 border-gray-700 text-white'
                placeholder='動画のタイトルを入力'
              />
            </div>
            <Tabs defaultValue='code' className='w-full' onValueChange={setActiveTab}>
              <TabsList className='grid w-full grid-cols-3 bg-gray-800 p-1 rounded-md'>
                <TabsTrigger
                  value='code'
                  className='flex items-center py-2 px-3 rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700 transition-colors'
                >
                  <Code className='mr-2 h-4 w-4' /> Manimコード
                </TabsTrigger>
                <TabsTrigger
                  value='manim-file'
                  className='flex items-center py-2 px-3 rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700 transition-colors'
                >
                  <File className='mr-2 h-4 w-4' /> Manimファイル
                </TabsTrigger>
                <TabsTrigger
                  value='video'
                  className='flex items-center py-2 px-3 rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white hover:bg-gray-700 transition-colors'
                >
                  <Film className='mr-2 h-4 w-4' /> 動画ファイル
                </TabsTrigger>
              </TabsList>
              <TabsContent value='code' className='space-y-2 mt-4'>
                <Label htmlFor='manim-code' className='text-lg'>
                  Manimコード
                </Label>
                <Textarea
                  id='manim-code'
                  value={manimCode}
                  onChange={(e) => setManimCode(e.target.value)}
                  className='w-full h-40 bg-gray-800 border-gray-700 text-white'
                  placeholder='Manimコードを入力'
                />
              </TabsContent>
              <TabsContent value='manim-file' className='space-y-2 mt-4'>
                <Label htmlFor='manim-file' className='text-lg'>
                  Manimファイル
                </Label>
                <Input
                  id='manim-file'
                  type='file'
                  accept='.py'
                  onChange={handleManimFileChange}
                  className='w-full bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-gray-600'
                />
              </TabsContent>
              <TabsContent value='video' className='space-y-2 mt-4'>
                <Label htmlFor='video-file' className='text-lg'>
                  動画ファイル
                </Label>
                <Input
                  id='video-file'
                  type='file'
                  accept='video/*'
                  onChange={handleVideoFileChange}
                  className='w-full bg-gray-800 border-gray-700 text-white file:bg-gray-700 file:text-white file:border-0 file:rounded-md file:px-4 file:py-2 hover:file:bg-gray-600'
                />
              </TabsContent>
            </Tabs>
            <div className='space-y-2'>
              <Label htmlFor='tags' className='text-lg'>
                タグ
              </Label>
              <Input
                id='tags'
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className='w-full bg-gray-800 border-gray-700 text-white'
                placeholder='カンマで区切ってタグを入力'
              />
            </div>
            {activeTab === 'video' ? (
              <Button type='submit' className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
                <Upload className='mr-2 h-4 w-4' /> 投稿する
              </Button>
            ) : (
              <Button type='submit' className='w-full bg-green-600 hover:bg-green-700 text-white'>
                <Video className='mr-2 h-4 w-4' /> 動画に変換
              </Button>
            )}
          </form>
        </div>
        <div className='space-y-4'>
          <h2 className='text-2xl font-semibold mb-4'>プレビュー</h2>
          <div className='aspect-video bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden'>
            {previewUrl ? (
              <video src={previewUrl} controls className='w-full h-full'>
                お使いのブラウザは動画タグをサポートしていません。
              </video>
            ) : (
              <div className='text-center'>
                <Play className='mx-auto h-16 w-16 text-gray-600' />
                <p className='mt-4 text-gray-400'>プレビューはここに表示されます</p>
              </div>
            )}
          </div>
          <div className='bg-gray-800 p-4 rounded-lg'>
            <h3 className='font-semibold mb-2'>{title || 'タイトル'}</h3>
            <p className='text-sm text-gray-400 mb-2'>タグ: {tags || 'なし'}</p>
            {manimCode && (
              <p className='text-sm text-gray-400'>Manimコード長: {manimCode.length} 文字</p>
            )}
            {manimFile && <p className='text-sm text-gray-400'>Manimファイル: {manimFile.name}</p>}
            {videoFile && <p className='text-sm text-gray-400'>動画ファイル: {videoFile.name}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react'
import Header from '@/components/Header'

export default function WatchPage() {
  return (
    <div className='min-h-screen bg-white'>
      <Header />
      <main className='container mx-auto p-4 flex flex-col md:flex-row gap-4'>
        <div className='md:w-3/4'>
          <div className='aspect-video bg-gray-900 mb-4'></div>
          <h2 className='text-2xl font-bold mb-2'>Video Title</h2>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <Avatar>
                <AvatarImage src='/placeholder-avatar.jpg' alt='Creator' />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span className='font-semibold'>Creator Name</span>
            </div>
            <Button>Subscribe</Button>
          </div>
          <div className='flex gap-4 mb-4'>
            <Button variant='outline' className='flex items-center gap-2'>
              <ThumbsUp className='h-4 w-4' />
              1.5K
            </Button>
            <Button variant='outline' className='flex items-center gap-2'>
              <ThumbsDown className='h-4 w-4' />
              Dislike
            </Button>
            <Button variant='outline' className='flex items-center gap-2'>
              <Share2 className='h-4 w-4' />
              Share
            </Button>
          </div>
          <p className='mb-4'>
            Video description goes here. This is a brief overview of the video content.
          </p>
          <div className='mb-4'>
            <h3 className='text-xl font-semibold mb-2'>Comments</h3>
            <Input placeholder='Add a comment...' className='mb-2' />
            <Button>Comment</Button>
          </div>
        </div>
        <aside className='md:w-1/4'>
          <h3 className='text-xl font-semibold mb-4'>Related Videos</h3>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='flex gap-2 mb-4'>
              <div className='w-40 h-24 bg-gray-200'></div>
              <div>
                <h4 className='font-semibold'>Related Video {i}</h4>
                <p className='text-sm text-gray-600'>Creator Name</p>
                <p className='text-sm text-gray-600'>1M views • 1 day ago</p>
              </div>
            </div>
          ))}
        </aside>
      </main>
    </div>
  )
}
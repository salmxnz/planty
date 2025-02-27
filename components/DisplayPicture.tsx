import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { StyleSheet, View, Image } from 'react-native'
import { images } from '@/constants'
interface Props {
  size?: number
  url: string | null
  className?: string
}

export default function DisplayPicture({ url, size = 40, className }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)

      if (error) {
        throw error
      }

      const fr = new FileReader()
      fr.readAsDataURL(data)
      fr.onload = () => {
        setAvatarUrl(fr.result as string)
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error downloading image: ', error.message)
      }
    }
  }

  return (
    <View>
      <Image
        source={avatarUrl ? { uri: avatarUrl } : images.profile}
        className={className || "w-[40px] h-[40px] rounded-full bg-white shadow-[0px_20px_25px_10px_rgba(0,0,0,0.15)] dark:shadow-[0px_20px_25px_10px_rgba(250,250,250,0.15)]"}
        style={{ width: size, height: size }}
        resizeMode="cover"
      />
    </View>
  )
}

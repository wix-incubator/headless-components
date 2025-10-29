import { type FittingType, getPlaceholder, sdk, STATIC_MEDIA_URL } from '@wix/image-kit'
import { forwardRef, type ImgHTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useSize } from '@/hooks/use-size'
import './image.css'

const FALLBACK_IMAGE_URL = "https://static.wixstatic.com/media/12d367_4f26ccd17f8f4e3a8958306ea08c2332~mv2.png";

type ImageData = {
  id: string
  width: number
  height: number
}

const getImageData = (url: string): ImageData | undefined => {
  // wix:image://v1/${uri}/${filename}#originWidth=${width}&originHeight=${height}
  const wixImagePrefix = 'wix:image://v1/'
  if (url.startsWith(wixImagePrefix)) {
    const uri = url.replace(wixImagePrefix, '').split('#')[0].split('/')[0]

    const params = new URLSearchParams(url.split('#')[1] || '')
    const width = parseInt(params.get('originWidth') || '0', 10)
    const height = parseInt(params.get('originHeight') || '0', 10)

    return { id: uri, width, height }
  } else if (url.startsWith(STATIC_MEDIA_URL)) {
    const urlObj = new URL(url)
    if (urlObj.searchParams.get('originWidth') && urlObj.searchParams.get('originHeight')) {
      const uri = urlObj.pathname.split('/').slice(2).join('/')
      const width = parseInt(urlObj.searchParams.get('originWidth') || '0', 10)
      const height = parseInt(urlObj.searchParams.get('originHeight') || '0', 10)
      return { id: uri, width, height }
    }
  }
}

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: FittingType
}

type WixImageProps = Omit<ImageProps, 'src'> & { data: ImageData }
const WixImage = forwardRef<HTMLImageElement, WixImageProps>(
  ({ data, fittingType = 'fill', ...imgProps }, parentRef) => {
    const ref = useRef<HTMLImageElement | null>(null)
    const size = useSize(ref)

    // Expose the ref to the parent component
    useImperativeHandle(parentRef, () => ref.current as HTMLImageElement)

    if (!size) {
      const { uri, ...placeholder } = getPlaceholder(fittingType ?? 'fit', data, { htmlTag: 'img' })
      return <img ref={ref} src={`${STATIC_MEDIA_URL}${uri}`} {...placeholder} {...imgProps} />
    }

    const scale = fittingType === 'fit' ? sdk.getScaleToFitImageURL : sdk.getScaleToFillImageURL
    const height = size.height || data.height * (size.width / data.width) || data.height
    const width = size.width || data.width * (size.height / data.height) || data.width
    const src = scale(data.id, data.width, data.height, width, height)

    return <img ref={ref} {...imgProps} src={src} />
  }
)
WixImage.displayName = 'WixImage'

export const Image = forwardRef<HTMLImageElement, ImageProps>(({ src, ...props }, ref) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src)

  useEffect(() => {
    // If src prop changes, update the imgSrc state
    setImgSrc((prev) => {
      if (prev !== src) {
        return src
      }
      return prev
    })
  }, [src])

  if (!src) {
    return <div data-empty-image ref={ref} {...props} />
  }

  const imageProps = {...props, onError: () => setImgSrc(FALLBACK_IMAGE_URL)}
  const imageData = getImageData(imgSrc)

  if (!imageData) {
    return <img data-error-image={imgSrc === FALLBACK_IMAGE_URL} ref={ref} src={imgSrc} {...imageProps} />
  }

  return <WixImage ref={ref} data={imageData} {...imageProps} />
})
Image.displayName = 'Image'

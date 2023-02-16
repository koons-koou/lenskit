import { useProfiles } from '@lenskit/react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import LensCalendar from '../components/LensCalendar'
import Placeholder from '../components/Placeholder'
import ProfileStats from '../components/ProfileStats'
import { fetchDataPoints } from '../lib/datapoints'
import {
  ShareIcon,
} from '@heroicons/react/24/solid'

import { useRef, useState } from 'react'
// @ts-ignore
import html2canvas from 'html2canvas';
import Image from 'next/image'
import Link from 'next/link'

const homeUrl = 'https://score.lenschina.xyz';
export default function Profile({
  initHandle,
}: { initHandle?: string }): JSX.Element {
  const router = useRouter()
  const handle = initHandle ?? router.query.handle?.toString()
  const realhandle =
    handle == 'lensprotocol' ? handle : handle?.endsWith('.lens') ? handle : handle + '.lens';
  const [saveLoading,setSaveLoading] = useState(false);
  const { profiles, loading, error } = useProfiles({ handles: [realhandle] })
  const profileId = profiles && profiles.length > 0 && profiles[0].id;
  const ref = useRef(null);

  const { data: data2022 } = useSWR(profileId ? [profileId, 2022] : null, ([profileId, year]) =>
    fetchDataPoints(profileId, year)
  )

  const { data: data2023 } = useSWR(profileId ? [profileId, 2023] : null, ([profileId, year]) =>
    fetchDataPoints(profileId, year)
  )

  if (loading) {
    return <Placeholder message="加载中 ..." description="首次加载可能需要一些时间" />
  } else if (!profiles || profiles.length == 0) {
    return <Placeholder message="404 | 未找到" />
  } else if (!data2022 || !data2023) {
    return <Placeholder message="加载中 ..." description="首次加载可能需要一些时间" />
  }

  if (data2022?.error || data2023.error) {
    return (
      <Placeholder
        message="错误 | Cloudflare免费等级已结束"
        description="请改日再试。
        谢谢你的耐心。
        将很快解决这个问题。"
      />
    )
  }

  const downloadImage = ()=>{
    if(ref.current && typeof window !== 'undefined'){
      setSaveLoading(true)
      html2canvas(ref.current,{
        //@ts-ignore
        dpi: window.devicePixelRatio * 2, // 对应屏幕的dpi，适配高清屏，解决canvas模糊问题
        scale: 2, // 缩放
        allowTaint: true, // 是否使用图片跨域
        useCORS: true, // 是否使用图片跨域
        backgroundColor: null,
      }).then(async (canvas: any) => {
        const save_url = await canvas.toDataURL("image/png");
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = save_url;
        a.target = '_blank';
        a.download = `${realhandle.replace(/.lens$/,'')}.png`;
        a.click();
        setTimeout(()=>{
          setSaveLoading(false);
        },500);
      }).catch(()=>setSaveLoading(false));
    }
  }

  return (
    <div className="md:my-12 md:mt-12 md:relative max-w-screen-xl mx-auto" > 
      <div
        className={
          `mx-auto max-w-screen-md flex flex-col items-center justify-start pt-12 pb-4 px-3 rounded-2xl ` +
          randomGradient()
        }
        ref={ref}
      >
        <ProfileStats handle={realhandle} datapoints={[...data2022,...data2023]}/>
        {data2023 && <LensCalendar profileId={profileId} year={2023} datapoints={data2023} />}
        {data2022 && <LensCalendar profileId={profileId} year={2022} datapoints={data2022} />}
        <div className="mt-4 px-8 w-full flex flex-col md:flex-row items-center justify-between text-white text-left">
          <Link href={homeUrl+'/'+realhandle} target="_blank" className="hover:text-teal-800">{homeUrl+'/'+realhandle}</Link>
          <Image
                  className="rounded-full"
                  src={'/lens-logo-china.png'}
                  alt=""
                  width={200}
                  height={62}
                  placeholder="blur"
                  blurDataURL="/lens-logo-china.png"
                />
        </div>
      </div>
      <button disabled={saveLoading} onClick={()=>downloadImage()} className="fixed md:absolute bottom-10 right-5 md:right-20 md:top-10 rounded-full bg-gray-100 text-teal-600 shadow-xl cursor-pointer p-2 w-12 h-12 flex items-center justify-center text-center hover:rotate-12 hover:text-green-700">
        {saveLoading ? '生成中...' : <ShareIcon className="w-8 h-8"/> }
      </button>
    </div>
  )
}

const gradients = [
  'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500',
  'bg-gradient-to-r from-green-300 via-blue-500 to-purple-600',
  'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
  'bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100',
  'bg-gradient-to-r from-green-200 via-green-300 to-blue-500',
]

function randomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)]
}

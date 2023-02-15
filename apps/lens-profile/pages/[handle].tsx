import { useProfiles } from '@lenskit/react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import LensCalendar from '../components/LensCalendar'
import Placeholder from '../components/Placeholder'
import ProfileStats from '../components/ProfileStats'
import { fetchDataPoints } from '../lib/datapoints'

export default function Profile({
  initHandle,
}: { initHandle?: string }): JSX.Element {
  const router = useRouter()
  const handle = initHandle ?? router.query.handle?.toString()
  const realhandle =
    handle == 'lensprotocol' ? handle : handle?.endsWith('.lens') ? handle : handle + '.lens'
  const { profiles, loading, error } = useProfiles({ handles: [realhandle] })
  const profileId = profiles && profiles.length > 0 && profiles[0].id

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

  return (
    <div className="mx-auto md:my-12 md:mt-12 max-w-screen-xl w-full h-full"> 
      <div
        className={
          `mx-auto max-w-screen-md flex flex-col items-center space-y-10 rounded-2xl p-6 md:p-12 shadow-2xl md:px-3 ` +
          randomGradient()
        }
      >
        <ProfileStats handle={realhandle} />
        {data2023 && <LensCalendar profileId={profileId} year={2023} datapoints={data2023} />}
        {data2022 && <LensCalendar profileId={profileId} year={2022} datapoints={data2022} />}
      </div>
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

'use client'

import { useProfiles } from '@lenskit/react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarData } from 'react-activity-calendar'
import Placeholder from './Placeholder'

interface ProfileStatsProps {
  handle?: string
  profileId?: string
  ownedBy?: string,
  datapoints: CalendarData[]
}

const ipfsGateway = 'https://lens.infura-ipfs.io'
const lensFrensUrl = 'https://www.lensfrens.xyz'

const ProfileStats: React.FC<ProfileStatsProps> = ({ handle, profileId, ownedBy, datapoints }) => {
  if (!profileId && !handle && !ownedBy) {
    throw new Error('必须提供handle、profileId或ownerBy中的一个。')
  }

  let queryOptions: any = {}
  if (handle) {
    queryOptions.handles = handle
  } else if (profileId) {
    queryOptions.profileIds = profileId
  } else if (ownedBy) {
    queryOptions.ownedBy = ownedBy
  }

  const { profiles, loading, error } = useProfiles(queryOptions)
  const profile = profiles?.[0]

  if (loading || !profile) {
    return <Placeholder message="正在加载... - 首次加载可能需要一些时间" />
  }


  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl bg-gradient-to-br from-lime-50 to-teal-100  p-7 shadow-md">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 items-center justify-between space-x-3">
          <div className="flex items-center space-x-5">
            <div className="flex-shrink-0">
              <div className="relative">
                <Image
                  className="rounded-full"
                  // @ts-ignore
                  src={getIPFSURL(profile?.picture?.original?.url) || '/profile.png'}
                  alt=""
                  width={64}
                  height={64}
                  placeholder="blur"
                  blurDataURL="/profile.png"
                />
                <span className="absolute inset-0 rounded-full" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
              <p className="text-sm font-medium text-gray-700">{profile.bio}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 text-center md:text-right">在 Lens 上关注</div>
            <div><Link className="bg-basil text-peas rounded-md px-2 py-1 text-2xl" href={`${lensFrensUrl}/${profile.handle}`} target={'_blank'} >{profile.handle}</Link></div>
          </div>
        </div>
        <div className="md:ml-12 flex flex-col items-center sm:flex-row mt-6 md:mt-0">
          <div className="mt-4 flex flex-col space-y-1">
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>总粉丝数</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalFollowers)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <span>总关注数</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalFollowing)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                </svg>
                <span>总发帖量</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalPosts)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24" className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                <span>总评论量</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalComments)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
                </svg>
                <span>总转贴量</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalMirrors)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <span>总发布量</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalPublications)}</div>
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="font-semibold text-teal-600 flex items-center justify-center space-x-2">
                <svg width='1rem' height='1rem' viewBox="0 0 24 24"  className="h-4 w-4 fill-teal-600">
                  <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z"></path>
                </svg>
                <span>总收藏量</span>
              </div>
              <div className="ml-3 font-semibold text-teal-700">{formatNumber(profile.stats.totalCollects)}</div>
            </div>
          </div>
          <div className="mx-auto mt-3">
            <CircleProgressBar level={superLevel(profile.stats, datapoints as any)} />
          </div>
        </div>
    </div>
  )
}

interface CircleProgressBarProps {
  level: string // A value between D、C、B、A、S
}
export const CircleProgressBar: React.FC<CircleProgressBarProps> = (props) => {
  const progress = levelToProgress(props.level)
  const radius = 100 // The radius of the circle
  const circumference = 2 * Math.PI * radius // The circumference of the circle
  const strokeDashoffset = circumference - (progress / 100) * circumference // The length of the progress bar
  const stroke = 15
  const normalizedRadius = radius - stroke * 2

  return (
    <div className="inline-flex  transform items-center justify-center overflow-hidden rounded-full">
      <svg
        width={2 * radius}
        height={2 * radius}
        className="transition-transform duration-500 hover:rotate-90"
      >
        <circle
          className="text-green-300"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          className="text-green-500"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <span className="text-basil absolute text-3xl font-extrabold transition-transform duration-500 hover:scale-125">
        {props.level}
      </span>
    </div>
  )
}

// url: ipfs://bafybeiewog3iscltj6uvus6iut5kerbbkyxovjhvnikrc4luy5sap6w3zu
function getIPFSURL(url: string) {
  if (url && url.startsWith('ipfs://')) {
    const cid = url.replace('ipfs://', '')
    return `${ipfsGateway}/ipfs/${cid}`
  }
  return url
}

function formatNumber(num: number): string {
  let formattedNumber = num.toLocaleString('en-US')
  if (num >= 1000) {
    formattedNumber = (num / 1000).toFixed(1) + 'K'
  }
  if (num >= 1000000) {
    formattedNumber = (num / 1000000).toFixed(1) + 'M'
  }
  return formattedNumber
}

function levelToProgress(level: string) {
  switch (level) {
    case 'S':
      return 100
    case 'A':
      return 80
    case 'B':
      return 60
    case 'C':
      return 40
    case 'D':
      return 20
    default:
      return 0
  }
}
// D、C、B、A、S
function publicationsCountToLevel(count: number) {
  if (count >= 1000) {
    return 'S'
  }
  if (count >= 500) {
    return 'A'
  }
  if (count >= 100) {
    return 'B'
  }
  if (count >= 50) {
    return 'C'
  }
  return 'D'
}

// 
function computingLevel(stats: { totalFollowers: number, totalFollowing: number, totalPosts: number, totalComments: number, totalMirrors: number, totalPublications: number, totalCollects: number }) {
  const count = (1 + Math.sqrt(stats.totalFollowers)) * (Math.sqrt(stats.totalFollowing + stats.totalPublications) + Math.sqrt(stats.totalCollects / stats.totalPublications) + 1)
  if (count >= 4000) {
    return 'S'
  }
  if (count >= 1500) {
    return 'A'
  }
  if (count >= 500) {
    return 'B'
  }
  if (count >= 100) {
    return 'C'
  }
  return 'D'
}

function superLevel(
  stats: { totalFollowers: number, totalFollowing: number, totalPosts: number, totalComments: number, totalMirrors: number, totalPublications: number, totalCollects: number }, 
  publications: [{ date: string, count: number, level: number }]
  ) {
  let ascore = 1 - Math.exp(-Math.sqrt(stats.totalFollowers + 1) / 25)
  let bscore = 0
  for (let i = 0; i < publications.length; i++) {
    if (i < 90) bscore += publications[i].count > 1 ? 1 : 0
    else if (i < 120) bscore += publications[i].count > 1 ? 0.5 : 0
    else bscore += publications[i].count > 1 ? 0.25 : 0
  }
  bscore = Math.min(1, bscore / 90)
  let cscore = stats.totalCollects / stats.totalPosts +
    (stats.totalPosts * 0.5 + stats.totalComments * 0.25 + stats.totalMirrors * 0.25);
  cscore = Math.min(Math.sqrt(cscore) / 20, 1)
  const count = ascore * bscore * cscore

  if (count >= 0.8) return 'S'
  else if (count >= 0.5) return 'A'
  else if (count >= 0.25) return 'B'
  else if (count >= 0.1) return 'C'
  else return 'D'
}

export default ProfileStats

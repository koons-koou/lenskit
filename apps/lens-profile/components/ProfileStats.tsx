'use client'
import {
  ChatBubbleLeftIcon,
  DocumentIcon,
  FolderIcon,
  ForwardIcon,
  PencilIcon,
  UserIcon,
  UsersIcon,
} from '@heroicons/react/24/solid'
import { useProfiles } from '@lenskit/react'
import { stat } from 'fs'
import Image from 'next/image'
import Link from 'next/link'
import Placeholder from './Placeholder'

interface ProfileStatsProps {
  handle?: string
  profileId?: string
  ownedBy?: string
}
const statsIcons: any = {
  totalFollowers: <UsersIcon />,
  totalFollowing: <UserIcon />,
  totalPosts: <PencilIcon />,
  totalComments: <ChatBubbleLeftIcon />,
  totalMirrors: <ForwardIcon />,
  totalPublications: <DocumentIcon />,
  totalCollects: <FolderIcon />,
}

const ipfsGateway = 'https://lens.infura-ipfs.io'
const lensFrensUrl = 'https://www.lensfrens.xyz'
const ProfileStats: React.FC<ProfileStatsProps> = ({ handle, profileId, ownedBy }) => {
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
  const tr: any = {
    "totalFollowers":"总粉丝数", // 20
    "totalFollowing":"总关注数", // 5
    "totalPosts":"总发帖量", // 5
    "totalComments":"总评论量", // 5
    "totalMirrors":"总转贴量", // 5
    "totalPublications":"总发布量", // 30
    "totalCollects":"总收藏量" //  30
  }



  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 rounded-2xl bg-gradient-to-br from-lime-50 to-teal-100  p-7 shadow-md">
      <div className="col-span-1">
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
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700 text-center md:text-right">在 Lens 上关注</p>
            <Link className="bg-basil text-peas rounded-md px-2 py-1 text-2xl" href={`${lensFrensUrl}/${profile.handle}`} target={'_blank'} >{profile.handle}</Link>
          </div>
        </div>

        <div className="md:ml-12 flex flex-col items-center sm:flex-row mt-6 md:mt-0">
          <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-1">
            {Object.keys(profile.stats)
              .filter((stat: string) => (stat === '__typename' ? false : true))
              .map((stat: string) => (
                <div className="flex w-full items-center justify-between" key={stat}>
                  <div className="flex items-center space-x-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full text-teal-600">
                      {statsIcons[stat]}
                    </div>
                    <div className="font-semibold text-teal-700">
                      {tr[stat]}
                      {/* {stat.replace(/([A-Z])/g, ' $1').trim()}: */}
                    </div>
                  </div>
                  <span className="ml-3 font-semibold text-teal-700">
                    {/* @ts-ignore */}
                    {formatNumber(profile.stats[stat])}
                  </span>
                </div>
              ))}
          </div>
          <div className="mx-auto mt-3">
            <CircleProgressBar level={superComputingLevel(profile.stats)} />
          </div>
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
function superComputingLevel(stats: { totalFollowers:number,totalFollowing:number,totalPosts:number,totalComments:number,totalMirrors:number,totalPublications:number,totalCollects:number }){
  const count = (1 + Math.sqrt(stats.totalFollowers)) * (Math.sqrt(stats.totalFollowing + stats.totalPublications) + Math.sqrt(stats.totalCollects/stats.totalPublications) + 1 )
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

export default ProfileStats

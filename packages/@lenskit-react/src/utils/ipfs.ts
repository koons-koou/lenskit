import { create } from 'ipfs-http-client'
import { INFURA_PROJECT_ID, INFURA_SECRET } from './config'

const projectId = INFURA_PROJECT_ID
const secret = INFURA_SECRET

if (!projectId || !secret) {
  throw new Error('必须在.env中定义INFURA_PROJECT_ID和INFURA_SECRET才能运行。')
}

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: `Basic ${Buffer.from(`${projectId}:${secret}`, 'utf-8').toString('base64')}`,
  },
})

export const uploadIpfs = async <T>(data: T) => {
  const result = await client.add(JSON.stringify(data))

  console.log('upload result ipfs', result)
  return result
}

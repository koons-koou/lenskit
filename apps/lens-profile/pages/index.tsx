import { MagnifyingGlassIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [search, setSearch] = useState('')
  const handleSumbit = (e: any) => {
    e.preventDefault()
    window.open(`/${search}`, '_blank')
  }
  return (
    <>
      <section className="mt-20 md:mt-32 flex flex-col space-y-6">
        <div className="mx-auto max-w-screen-xl px-4 pb-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">LensScore</h1>
          <h2 className="mt-4 text-gray-700">探索 Lens Protocol 和有趣的内容</h2>
          <div className="mx-auto mt-4 grid max-w-lg text-sm leading-relaxed text-gray-500">
            可用的等级是S，A，B，C，和 D (所有人)。这些数值是通过使用总发帖量、转发、评论、关注等来进行加权计算的（持续优化）。
          </div>
        </div>
        <form className="mx-auto mb-0 flex" onSubmit={handleSumbit}>
          <div className="relative">
            <input
              className="h-10 rounded-lg border border-gray-200 pr-10 pl-3 text-sm placeholder-gray-300 focus:z-10"
              placeholder="输入Lens handle..."
              type="text"
              onInput={(e) => setSearch(e.currentTarget.value)}
            />

            <button
              type="submit"
              className="absolute inset-y-0 right-0 mr-px rounded-r-lg p-2 text-gray-600"
            >
              <MagnifyingGlassIcon className="h-5 w-5 font-bold" />
            </button>
          </div>
        </form>
        <div className="mx-auto flex space-x-3 text-gray-400 underline">
          <Link href="/lensprotocol" target={'_blank'}>
            lensprotocol
          </Link>
          <Link href="/stani.lens" target={'_blank'}>
            stani.lens
          </Link>
          <Link href="lensprotocol_cn.lens" target={'_blank'}>
            lensprotocol_cn.lens
          </Link>
        </div>
        <div className="mx-auto flex flex-col space-y-3 px-4 pb-12 sm:space-x-0 md:flex-row md:space-y-0 md:space-x-3">
          <Image
            className="rounded-lg"
            src="/profile1.png"
            width={400}
            height={300}
            alt="profile1"
          />
          <Image
            className="rounded-lg"
            src="/profile2.png"
            width={400}
            height={300}
            alt="profile2"
          />
          <Image
            className="rounded-lg"
            src="/profile3.png"
            width={400}
            height={300}
            alt="profile3"
          />
        </div>
      </section>
      <footer className="border-t border-gray-100">
        <div className="mx-auto max-w-screen-xl px-4 py-12">
          <Link className="inline-flex gap-1.5 text-lg  font-medium" href="/">
            <span>LensScore</span>
            <span aria-hidden="true" role="img">
              🌿
            </span>
          </Link>
          <div className="mt-6 lg:flex lg:items-end lg:justify-between">
            <div>
              <p className="relin-paragraph-target max-w-md leading-relaxed text-gray-500">
              用于探索用户在Lens上活跃程度的开源工具。
              </p>
              <div className="mt-4 flex space-x-3">
                <a
                  href="https://twitter.com/LensProtocol_CN"
                  rel="noreferrer"
                  target="_blank"
                  className="text-gray-700 transition hover:opacity-75"
                >
                  <span className="sr-only">Twitter</span>

                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <p className="relin-paragraph-target mt-4 text-sm text-gray-500 lg:mt-0">
              &copy; <Link href="https://lenschina.xyz" target="_blank" className="hover:text-teal-600"> lenschina </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

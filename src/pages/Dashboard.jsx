import React from 'react'
import MailIcon from '../components/MailIcon'
// import { QRCodeSVG } from 'qrcode.react';

const Dashboard = () => {

 

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl flex flex-col gap-4">

        {/* Row 1 */}
        <div className="flex flex-col sm:flex-row gap-4">

          {/* Card A — Profile */}
          <div className="relative flex flex-col justify-between rounded-2xl bg-[#0a0a0a] flex-1 min-h-[240px] sm:min-h-[260px] overflow-hidden p-5">

           
            {/* <div className="relative flex items-center justify-between z-10">
              <span className="text-[16px] tracking-[0.16em] uppercase text-[#555]">
                Admin Profile
              </span>
             
            </div> */}

            {/* ── Avatar + info ── */}
            <div className="relative z-10 flex items-center gap-4 my-auto py-4">
              {/* Avatar with dashed ring */}
              <div className="relative flex-shrink-0">
        
                <div className="w-[84px] h-[84px] rounded-full bg-[#111]  flex items-center justify-center text-[30px]  text-[#e0e0e0] ">
                  AK
                </div>
              
              </div>

              {/* Name / role / email */}
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[24px] font-semibold text-[#e8e8e8] leading-tight tracking-tight">
                  Arnold K.
                </p>
                <p className="text-[14px] tracking-[0.14em] uppercase text-[#444]">
                  Elite Member
                </p>
                <div className="flex items-center gap-1.5 text-[16px] text-[#606060] mt-0.5">
                  <span className="truncate">arnold@example.com</span>
                </div>
              </div>
            </div>

            {/* ── Bottom stat strip ── */}
            <div className="relative z-10 flex items-center rounded-md bg-[#111]  overflow-hidden">
              {[
                { label: 'Sessions', value: '248' },
                { label: 'Streak', value: '14d' },
                { label: 'Since', value: '2022' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 ${i < 2 ? 'border-r border-[#1a1a1a]' : ''}`}
                >
                  <span className="text-[15px] font-semibold text-[#d0d0d0]">{s.value}</span>
                  <span className="text-[10px] uppercase tracking-[0.1em] text-[#3a3a3a]">{s.label}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Card B */}
          <div className="rounded-2xl bg-[#0a0a0a] sm:flex-[1.4] min-h-[200px] sm:min-h-[240px]" />
        </div>

        {/* Row 2 */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="rounded-2xl bg-[#0a0a0a] flex-1 min-h-[200px] sm:min-h-[240px]" />
          <div className="rounded-2xl bg-[#0a0a0a] sm:flex-[1.6] min-h-[200px] sm:min-h-[240px]" />
          <div className="rounded-2xl bg-[#0a0a0a] sm:flex-[0.8] min-h-[200px] sm:min-h-[240px]" />
        </div>

      </div>
      
    </div>
  )
}

export default Dashboard
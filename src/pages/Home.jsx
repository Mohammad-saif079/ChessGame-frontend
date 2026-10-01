import { useEffect } from 'react'
import Board from '../components/Board'
import { QRCodeSVG } from 'qrcode.react';
import Eye from '../components/Eye';
import CloseEye from '../components/CloseEye';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LockIcon from '../components/LockIcon';
import OtpIcon from '../components/OtpIcon';
import JoinIcon from '../components/JoinIcon';
import CompassIcon from '../components/CompassIcon';
import UserIcon from '../components/UserIcon';
import ChessKingIcon from '../components/ChessKingIcon';
import BoardTileIcon from '../components/BoardTile';
import ScanIcon from '../components/ScanIcon';
import LinkIcon from '../components/LinkIcon';
import CopyIcon from '../components/CopyIcon';
import { useGame } from '../context/GameContext';

const Home = () => {

  const gameid = useParams().gameid

  // console.log(gameid)

  const [type, settype] = useState("join")
  const [isplaying, setisplaying] = useState(false)
  const [waiting, setwaiting] = useState(true)

  const [createpassword, setcreatepassword] = useState("")
  console.log(createpassword)

  const [eyeone, seteyeone] = useState(false)
  const [eyetwo, seteyetwo] = useState(false)
  const [roomid, setroomid] = useState("")
  const [roompassword, setroompassword] = useState("")
  const [color, setcolor] = useState("Random")

  const { remotemove, setremotemove } = useGame()

  const navigate = useNavigate()



  useEffect(() => {
    const token = document.cookie
    console.log("Token from cookie:", token)
  }, [])



  return (
    <div className='w-full flex justify-center items-center h-[100svh] gap-5 bg-[#0B0E14] '  >

      <div className="mainboard gap-1 flex flex-col justify-center">

        <div className="opponent flex items-center gap-2">

          <UserIcon color='#ffffff' size={40} />
          <h1 className='text-[#ffffff] text-[22px]'>waiting for opponent</h1>

        </div>

        <Board size={500} lastMove={null} player="white" fen="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" />

        <div className="user flex items-center gap-2">

          <UserIcon color='#718096' size={40} />
          <h1 className='text-[#718096] text-[22px]'>{`Saifu (You)`}</h1>

        </div>

      </div>


      {isplaying ? (
        <h1>playing</h1>
      ) : waiting ? (
        <div className="createbox w-[90%] md:w-[500px] flex flex-col gap-1">

          <div className="fieldone flex flex-col mb-2 gap-1 " >


            <h1 className='text-white text-[22px]' >{`Waiting for opponent`}
              {/* <DotLoader  color="#ffffff" /> */}
            </h1>

            <div className="piececolor flex items-center gap-2">
              <div onClick={() => { setcolor("White") }} className=' rounded-lg overflow-hidden ' >
                <ChessKingIcon size={65} pieceColor='white' />
              </div>

              <div className=' px-1 text-[22px] text-[#94A3B8] rounded-lg overflow-hidden' >
                vs
              </div>

              <div onClick={() => { setcolor("Black") }} className=' rounded-lg overflow-hidden' >
                {/* <ChessKingIcon size={65} pieceColor='black' /> */}
                <div className=' flex justify-center items-center relative '  >
                  <BoardTileIcon size={65} />

                  <span className=" absolute animate-spin  w-[30px] h-[30px] border-3 border-[#ffffff] border-t-transparent rounded-full"></span>

                </div>
              </div>



            </div>

          </div>



          <div className="global w-full flex mb-1 items-center gap-2">
            <QRCodeSVG value="http://localhost:5173" size={200} bgColor="#0B0E14" className="m-1" fgColor="#ffffff" />
            <div>
              <div className='  text-[35px] text-white ' >{`{`}</div>

              <div className='credentials translate-x-10 text-[22px] flex items-center' >
                <h1 className='text-[#94A3B8] mr-2 ' >Room admin:</h1>
                <h1 className='text-[#ffffff]' >saifuuu</h1>
                <h1 className='text-[#ffffff]' >,</h1>
              </div>
              <div className='credentials translate-x-10 text-[22px] flex items-center' >
                <h1 className='text-[#94A3B8] mr-2 ' >Room id:</h1>
                <h1 className='text-[#ffffff]' >zxcvbnm</h1>
                <h1 className='text-[#ffffff]' >,</h1>
              </div>
              <div className='credentials translate-x-10 text-[22px] flex items-center' >
                <h1 className='text-[#94A3B8] mr-2' >Room password:</h1>
                <h1 className='text-[#ffffff]' >*******</h1>
              </div>

              <div className=' text-[35px] text-white ' >{`}`}</div>

            </div>

          </div>

          <div className="global w-full flex justify-center flex-col gap-0.8">
            <div className="relative overflow-hidden  input w-full flex items-center bg-[#1A1F26] rounded-lg p-2">
              <div className="  ">

                <LinkIcon size={40} color='#718096' />
              </div>

              <div className='w-full py-1 pl-2 bg-[#1A1F26] outline-none text-[22px]  text-[#718096] ' >
                {`http://localhost:5173/join/zxcvbnm`}
              </div>
              <div className='p-2 absolute right-0 rounded-lg bg-[#1A1F26] '>
                <CopyIcon size={40} color='#718096' />
              </div>


            </div>


          </div>







          <div className=" text-center text-[#94A3B8] text-[18px] w-full">OR</div>


          <div onClick={() => { settype("join"); setwaiting(false) }} className="actionbtn w-full  h-[49px] text-[22px] bg-[#1A1F26]  rounded-lg flex justify-center items-center text-[#718096] ">
            <JoinIcon size={50} color='#718096' />

            Disband Room

          </div>

          <div className="text-center text-[#94A3B8] text-[16px] w-full mt-2">
            Invite a Challenger: Share this QR code to start the match.
          </div>

          <button onClick={() => setremotemove(crypto.randomUUID())}>perform remote move</button>

        </div>

      ) : (
        <div className="joinbox w-[90%] md:w-[500px] flex flex-col gap-0.85">
          <div className="global w-full flex justify-center flex-col gap-0.8">


            <div className="overflow-hidden input w-full flex items-center bg-[#1A1F26] rounded-lg p-2">
              <div className="  ">
                <OtpIcon size={40} color='#718096' />

              </div>
              <input onChange={(e) => setroomid(e.target.value)} placeholder='Room ID' className='w-full py-1 pl-2 bg-[#1A1F26] outline-none text-[22px] placeholder:text-[#718096] text-white ' type="text" />
              <div>
                <ScanIcon size={40} color='#718096' />
              </div>

            </div>
            <div className="text-lg h-[28px] text-[#F87171] error">{ }</div>
          </div>
          <div className="global w-full flex justify-center flex-col gap-0.8">
            <div className="relative overflow-hidden  input w-full flex items-center bg-[#1A1F26] rounded-lg p-2">
              <div className="  ">
                <LockIcon size={40} color='#718096' />
              </div>
              <input value={roompassword} onChange={(e) => setroompassword(e.target.value)} placeholder='Room Password' className='w-full py-1 pl-2 bg-[#1A1F26] outline-none text-[22px] placeholder:text-[#718096] text-white ' type={eyeone ? "text" : "password"} />
              <div onClick={() => seteyeone(!eyeone)} className='p-2 absolute right-0 rounded-lg bg-[#1A1F26] '>
                {eyeone ? <Eye size={35} color='#718096' /> : <CloseEye size={35} color='#718096' />}
              </div>


            </div>
            <div className="text-lg h-[28px] text-[#F87171] error">{ }</div>

          </div>



          <div className="actionbtn w-full  h-[49px] text-[22px] flex justify-center items-center bg-[#222953]  rounded-lg  text-[#ffffff] ">
            <JoinIcon size={50} color='#ffffff' />
            Join Room</div>


          <div className=" text-center text-[#94A3B8] text-[18px] w-full">OR</div>
          <div className="fieldone flex flex-col mb-2 gap-1 " >


            <h1 className='text-white text-[22px]' >{`You Play As ${color}`}</h1>

            <div className="piececolor flex items-center gap-2">
              <div onClick={() => { setcolor("White") }} className=' rounded-lg overflow-hidden ' >
                <ChessKingIcon size={65} pieceColor='white' />
              </div>

              <div onClick={() => { setcolor("Black") }} className=' rounded-lg overflow-hidden' >
                <ChessKingIcon size={65} pieceColor='black' />
              </div>


              <div onClick={() => { setcolor("Random") }} className=' rounded-lg overflow-hidden' >
                <BoardTileIcon size={65} />
              </div>

            </div>

          </div>



          <div className="global w-full flex justify-center flex-col gap-0.8">
            <div className="relative overflow-hidden  input w-full flex items-center bg-[#1A1F26] rounded-lg p-2">
              <div className="  ">
                <LockIcon size={40} color='#718096' />
              </div>
              <input value={createpassword} onChange={(e) => setcreatepassword(e.target.value)} placeholder='Set Password' className='w-full py-1 pl-2 bg-[#1A1F26] outline-none text-[22px] placeholder:text-[#718096] text-white ' type={eyetwo ? "text" : "password"} />
              <div onClick={() => seteyetwo(!eyetwo)} className='p-2 absolute right-0 rounded-lg bg-[#1A1F26] '>
                {eyetwo ? <Eye size={35} color='#718096' /> : <CloseEye size={35} color='#718096' />}
              </div>


            </div>
            <div className="text-lg h-[28px] text-[#F87171] error">{ }</div>

          </div>



          <div onClick={() => { navigate("/zxcbnm") }} className="actionbtn w-full  h-[49px] text-[22px] flex justify-center items-center bg-[#222953]  rounded-lg  text-[#ffffff] ">
            <CompassIcon size={50} color='#ffffff' />
            Create Room</div>


        </div>
      )
      }



    </div >
  )
}

export default Home
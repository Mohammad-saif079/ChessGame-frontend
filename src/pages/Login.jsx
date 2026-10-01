import MailIcon from '../components/MailIcon'
import LockIcon from '../components/LockIcon'
import Eye from '../components/Eye'
import CloseEye from '../components/CloseEye'
import { useState } from 'react'
import GoogleLogo from '../components/Google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const [username, setusername] = useState("")
    const [password, setpassword] = useState("")
    const [eye, seteye] = useState(false)
    const [err1, seterr1] = useState("")
    const [err2, seterr2] = useState("")

    const handlegooglelogin = () => {
        navigate("http://localhost:5500/auth/google")
    }

    const handlelogin = async () => {
        if (loading) return
        let haserror = false
        if (username === "") { seterr1("Email is required"); haserror = true } else { seterr1("") }
        if (password === "") { seterr2("Password is required"); haserror = true } else { seterr2("") }
        if (!haserror) {
            setloading(true)
            const api = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL })
            const response = await api.post("/user/authuser", { email: username, password: password })
            console.log(response.data)
            if (response.data.success) { localStorage.setItem("AuthToken", response.data.token); navigate("/") }
            else { seterr2(response.data.message) }
            setloading(false)
        }
    }

    return (
        <div className='w-full flex justify-center items-center h-[100svh] bg-[#000000] relative overflow-hidden'>

            <svg className="pointer-events-none absolute inset-0 w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <g opacity="1">
                    {/* 3x3 clusters */}
                    {[[40, 30], [540, 60], [880, 50], [230, 240], [500, 360], [200, 540], [820, 505]].map(([x, y], i) =>
                        Array.from({ length: 3 }, (_, row) =>
                            Array.from({ length: 3 }, (_, col) =>
                                <circle key={`a${i}${row}${col}`} cx={x + col * 12} cy={y + row * 12} r={1.5} fill="#ffffff" opacity={0.1} />
                            )
                        )
                    )}
                    {/* 4x4 clusters */}
                    {[[360, 20], [80, 380], [850, 370], [400, 500], [940, 480]].map(([x, y], i) =>
                        Array.from({ length: 4 }, (_, row) =>
                            Array.from({ length: 4 }, (_, col) =>
                                <circle key={`b${i}${row}${col}`} cx={x + col * 12} cy={y + row * 12} r={1.5} fill="#ffffff" opacity={0.1} />
                            )
                        )
                    )}
                    {/* 5x5 clusters */}
                    {[[160, 80], [700, 30], [20, 200], [930, 220], [280, 420], [680, 400], [30, 510], [600, 530]].map(([x, y], i) =>
                        Array.from({ length: 5 }, (_, row) =>
                            Array.from({ length: 5 }, (_, col) =>
                                <circle key={`c${i}${row}${col}`} cx={x + col * 12} cy={y + row * 12} r={1.5} fill="#ffffff" opacity={0.1} />
                            )
                        )
                    )}
                </g>
            </svg>

            <div className="loginbox relative z-10 w-[90%] md:w-[500px] flex flex-col gap-1">
                <div className="global w-full flex justify-center flex-col gap-0.8">
                    <div className="overflow-hidden input w-full flex items-center bg-[#0a0a0a]  rounded-lg p-2">
                        <div className=""><MailIcon size={40} color='#333333' /></div>
                        <input onChange={(e) => setusername(e.target.value)} placeholder='Email' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type="text" />
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err1}</div>
                </div>
                <div className="global w-full flex justify-center flex-col gap-0.8">
                    <div className="relative overflow-hidden input w-full flex items-center bg-[#0a0a0a]  rounded-lg p-2">
                        <div className=""><LockIcon size={40} color='#333333' /></div>
                        <input onChange={(e) => setpassword(e.target.value)} placeholder='Password' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type={eye ? "text" : "password"} />
                        <div onClick={() => seteye(!eye)} className='p-2 absolute right-0 rounded-lg bg-[#0a0a0a]'>
                            {eye ? <Eye size={35} color='#333333' /> : <CloseEye size={35} color='#333333' />}
                        </div>
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err2}</div>
                </div>
                <div className="w-full h-[27px]">
                    <div className="relative bottom-3 flex justify-end text-[#444444] text-[18px]">Forgot Password?</div>
                </div>
                <div onClick={handlelogin} className="actionbtn w-full h-[49px] py-2 text-[22px] bg-[#ffffff] rounded-lg flex justify-center items-center text-[#000000] font-medium">
                    {loading ? <span className="animate-spin w-[27px] h-[27px] border-3 border-[#000000] border-t-transparent rounded-full"></span> : "Checkmate"}
                </div>
                <div className="text-[18px] text-[#444444] text-center">Don't have an account? <span className='text-[#ffffff] py-2' onClick={() => { navigate("/create") }}>Create</span></div>
                <div className="text-center text-[#333333] text-[18px] w-full">OR</div>
                <div onClick={handlegooglelogin} className="actionbtn w-full flex justify-center items-center gap-2 py-2 text-[22px] bg-[#0a0a0a] rounded-lg text-[#e0e0e0]">
                    <GoogleLogo />
                    Continue with Google
                </div>
            </div>

        </div>
    )
}

export default Login
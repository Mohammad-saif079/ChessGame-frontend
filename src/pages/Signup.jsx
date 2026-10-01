import { useState, useEffect } from 'react'
import UserIcon from '../components/UserIcon'
import LockIcon from '../components/LockIcon'
import Eye from '../components/Eye'
import CloseEye from '../components/CloseEye'
import MailIcon from '../components/MailIcon'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Toaster from '../components/Toaster'
import gsap from 'gsap'
import OtpIcon from '../components/OtpIcon'
import GoogleLogo from '../components/Google'


const Signup = () => {

    const navigate = useNavigate()

    const [mode, setmode] = useState("otp")
    const [loading, setloading] = useState(false)

    const [eye, seteye] = useState(false)
    const [fullname, setfullname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [otp, setotp] = useState('')

    const [err1, seterr1] = useState("")
    const [err2, seterr2] = useState("")
    const [err3, seterr3] = useState("")
    const [err4, seterr4] = useState("")
    const [info, setinfo] = useState("You will receive an OTP on this email")
    const [otpsent, setotpsent] = useState(false)
    const [cansendotp, setcansendotp] = useState(true)
    const [timer, settimer] = useState(0)
    const [resendload, setresendload] = useState(false)


    useEffect(() => {
        let interval = null

        if (timer > 0) {
            interval = setInterval(() => {
                settimer(prev => prev - 1)
            }, 1000)
        } else if (timer === 0 && otpsent) {
            setcansendotp(true)
            setinfo("Didn't receive OTP?")
        }

        return () => clearInterval(interval)
    }, [timer, otpsent])

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === "") {
            seterr2("Email is required");
            return false;
        } else if (!regex.test(email)) {
            seterr2("Please enter a valid email address");
            return false;
        } else {
            seterr2("");
            return true;
        }
    };

    const handleclick = async () => {

        if (loading) return;

        if (mode === "otp") {

            if (!cansendotp) return;

            let hasError = false;

            if (!fullname.trim()) {
                seterr1("Name is required");
                hasError = true;
            } else {
                seterr1("");
            }

            if (!validateEmail(email)) {
                hasError = true;
            }

            if (hasError) return;

            setloading(true);

            try {
                await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/user/genotp`,
                    {
                        email: email.trim(),
                        name: fullname.trim()
                    }
                );

                setinfo("OTP sent successfully.");
                setotpsent(true);
                setcansendotp(false);
                setmode("create");
                settimer(120);

            } catch (error) {
                setinfo("Failed to send OTP. Please try again.");
            } finally {
                setloading(false);
            }

            return;
        }

        let hasError = false;

        if (!fullname.trim()) {
            seterr1("Name is required");
            hasError = true;
        } else {
            seterr1("");
        }

        if (!validateEmail(email)) {
            hasError = true;
        }

        if (!password) {
            seterr3("Password is required");
            hasError = true;
        } else if (password.length < 6) {
            seterr3("Password must be at least 6 characters");
            hasError = true;
        } else {
            seterr3("");
        }

        if (!otp) {
            seterr4("OTP is required");
            hasError = true;
        } else {
            seterr4("");
        }

        if (hasError) return;

        setloading(true);

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/user/createuser`,
                {
                    email: email.trim(),
                    password,
                    fullname: fullname.trim(),
                    otp: Number(otp)
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.success) {

                const tl = gsap.timeline()
                tl.to(".toaster", {
                    y: 20,
                    duration: 0.9,
                    scale: 1,
                    ease: "power4.out"
                })
                tl.to(".toaster", {
                    y: "-100%",
                    duration: 0.9,
                    scale: 1,
                    ease: "power4.out",
                    onComplete: () => {
                        localStorage.setItem("AuthToken", response.data.token)
                        navigate("/", { replace: true })
                    }
                })

            } else if (response.data.errors) {
                for (const err of response.data.errors) {
                    const lower = err.toLowerCase();

                    if (lower.includes("otp")) seterr4(err);
                    else if (lower.includes("password")) seterr3(err);
                    else if (lower.includes("email")) seterr2(err);
                    else if (lower.includes("name")) seterr1(err);
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            setloading(false);
        }
    };

    const handlegooglelogin = () => {
        navigate("http://localhost:5500/auth/google")
    }


    return (
        <div className='w-full flex justify-center items-center h-[100svh] bg-[#000000] relative overflow-hidden'>

            {/* dot pattern */}
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
                    <div className="overflow-hidden input w-full flex items-center bg-[#0a0a0a] rounded-lg p-2">
                        <div className="">
                            <UserIcon size={40} color='#333333' />
                        </div>
                        <input onChange={(e) => setfullname(e.target.value)} placeholder='Your Name' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type="text" />
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err1}</div>
                </div>

                <div className="global w-full flex justify-center flex-col gap-0.8">
                    <div className="overflow-hidden input w-full flex items-center bg-[#0a0a0a] rounded-lg p-2">
                        <div className="">
                            <MailIcon size={40} color='#333333' />
                        </div>
                        <input onChange={(e) => setemail(e.target.value)} placeholder='Choose Email' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type="email" />
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err2}</div>
                </div>

                <div className="global w-full flex justify-center flex-col gap-0.8">
                    <div className="relative overflow-hidden input w-full flex items-center bg-[#0a0a0a]  rounded-lg p-2">
                        <div className="">
                            <LockIcon size={40} color='#333333' />
                        </div>
                        <input onChange={(e) => setpassword(e.target.value)} placeholder='Choose Password' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type={eye ? "text" : "password"} />
                        <div onClick={() => seteye(!eye)} className='p-2 absolute right-0 rounded-lg bg-[#0a0a0a]'>
                            {eye ? <Eye size={35} color='#333333' /> : <CloseEye size={35} color='#333333' />}
                        </div>
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err3}</div>
                </div>

                <div className="global w-full flex justify-center flex-col gap-0.8">
                    <div className="relative overflow-hidden input w-full flex items-center bg-[#0a0a0a] rounded-lg p-2">
                        <div className="">
                            <OtpIcon size={40} color='#333333' />
                        </div>
                        <input onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            setotp(e.target.value)
                        }} maxLength={4} placeholder='Enter OTP' className='w-full py-1 pl-2 bg-[#0a0a0a] outline-none text-[22px] placeholder:text-[#333333] text-[#e0e0e0]' type="text" inputMode='numeric' />
                    </div>
                    <div className="text-lg h-[28px] text-[#F87171] error">{err4}</div>
                </div>

                <div className="w-full h-[27px]">
                    <div className="relative bottom-3 flex justify-end text-[#444444] text-[18px]">{info}
                        {otpsent && (
                            cansendotp
                                ? <span
                                    onClick={async () => {
                                        if (resendload) return;
                                        setresendload(true)
                                        try {
                                            await axios.post(
                                                `${import.meta.env.VITE_BACKEND_URL}/user/genotp`,
                                                {
                                                    email: email.trim(),
                                                    name: fullname.trim()
                                                }
                                            );
                                            setinfo("OTP sent successfully.");
                                            setcansendotp(false);
                                            settimer(120);
                                        } catch (error) {
                                            setinfo("Failed to resend OTP. Please try again.");
                                        } finally {
                                            setresendload(false)
                                        }
                                    }}
                                    className="text-[#ffffff] ml-2"
                                >
                                    {resendload ? <span className="animate-spin w-[15px] h-[15px] border-2 border-[#ffffff] border-t-transparent rounded-full inline-block"></span> : "Resend OTP"}
                                </span>
                                : <span className="ml-2">
                                    Resend in {timer}s
                                </span>
                        )}
                    </div>
                </div>

                <div onClick={handleclick} className="actionbtn w-full h-[49px] py-2 text-[22px] bg-[#ffffff] rounded-lg flex justify-center items-center text-[#000000] font-medium">
                    {loading ? <span className="animate-spin w-[27px] h-[27px] border-3 border-[#000000] border-t-transparent rounded-full"></span> : mode === "otp" ? "Send OTP" : "Create"}
                </div>

                <div className="text-[18px] text-[#444444] text-center">Already have an account? <span onClick={() => { navigate("/login") }} className='text-[#ffffff] py-2'>Login</span></div>
                <div className="text-center text-[#333333] text-[18px] w-full">OR</div>

                <div onClick={handlegooglelogin} className="actionbtn w-full flex justify-center items-center gap-2 py-2 text-[22px] bg-[#0a0a0a]  rounded-lg text-[#e0e0e0]">
                    <GoogleLogo />
                    Continue with Google
                </div>
            </div>

            <div className='toaster fixed top-0 translate-y-[-100%] scale-[1]'>
                <Toaster />
            </div>

        </div>
    )
}

export default Signup
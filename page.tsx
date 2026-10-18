"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Zap, Wallet, Twitter, Send, Linkedin, Youtube, Instagram, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

import { InteractiveEVEcosystem } from "@/components/ui/InteractiveEVEcosystem";
import { useNemesisStore } from "@/store/useNemesisStore";
import { useDepinStore } from "@/store/useDepinStore";
import { useSolanaWallet } from "@/context/SolanaWalletContext";
import { useUserAuthStore } from "@/store/useUserAuthStore";
import { WalletConnectionModal } from "@/components/ui/WalletConnectionModal";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // Local state
  const [authTab, setAuthTab] = useState<'email' | 'wallet'>('email');
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [mockOtpCode, setMockOtpCode] = useState("");

  // Global store
  const { connect, isConnected, status } = useSolanaWallet();

  const isConnecting = status === "connecting";

  // Watch wallet connection
  useEffect(() => {
    if (isConnected) {
      showToast(
        "success",
        "Wallet Connected",
        "Successfully authenticated with Solana wallet."
      );
      // Small delay to show toast, then redirect
      setTimeout(() => {
        router.push("/depin"); // Default route after login
      }, 1000);
    }
  }, [isConnected, router, showToast]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConnectSuccess = (chain: "solana" | "base" | "bnb", addr: string) => {
    localStorage.setItem(`nemesis-connected-${chain}-wallet`, addr);
    
    // Sync stores
    useDepinStore.getState().setWallet(addr);
    useNemesisStore.getState().setUserRole("investor");

    useUserAuthStore.setState({
      isAuthenticated: true,
      email: null,
      walletAddress: addr,
      otpSent: false,
      generatedOtp: null,
      error: null,
      isLoading: false,
    });

    showToast(
      "success",
      "Successfully logged in",
      `Connected via ${chain.toUpperCase()} wallet.`
    );

    router.push("/depin");
  };

  const handleWalletConnect = () => {
    setIsModalOpen(true);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simulate API call for sending OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    
    // Generate 6-digit mock OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMockOtpCode(code);
    setShowOtp(true);
    
    showToast(
      "info",
      "Verification code sent",
      `We've sent a 6-digit code to ${email}. Mock OTP: ${code}`
    );

    // Auto focus first OTP input
    setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single character
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return;

    if (otpString !== mockOtpCode) {
      showToast(
        "error",
        "Invalid verification code",
        "The code you entered does not match the mock OTP code."
      );
      return;
    }

    setIsSubmitting(true);
    // Simulate API call for verification
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    // Update global store
    const emailSlug = email ? email.split('@')[0].toUpperCase() : "USER";
    const mockWallet = `NMS_EML_${emailSlug}_${Math.floor(1000 + Math.random() * 9000)}`;
    useDepinStore.getState().setWallet(mockWallet);
    useNemesisStore.getState().setUserRole("investor");

    // Update useUserAuthStore to sync authenticated session
    useUserAuthStore.setState({
      isAuthenticated: true,
      email: email,
      walletAddress: mockWallet,
      otpSent: false,
      generatedOtp: null,
      error: null,
      isLoading: false,
    });

    showToast(
      "success",
      "Successfully logged in",
      "Welcome back to Nemesis Protocol."
    );

    router.push("/depin");
  };



  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* LEFT COLUMN: Authentication */}
      <div className="w-full lg:w-[35%] flex flex-col justify-between p-8 lg:p-12 border-r border-slate-100 relative z-10 bg-white shadow-2xl">
        
        {/* Top bar logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5">
              <Image
                src="/noc_logo.png"
                alt="Nemesis Protocol"
                width={24}
                height={24}
                priority
                className="object-contain"
              />
            </span>
            <span className="font-semibold text-xl tracking-tight text-slate-800">
              NEMESIS
            </span>
          </Link>
        </div>

        {/* Center Auth Form */}
        <div className="max-w-md w-full mx-auto mt-12 lg:mt-0 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {showOtp ? "Check your email" : "Login"}
            </h1>
            <p className="text-slate-500 text-sm">
              {showOtp 
                ? `We sent a verification code to ${email}`
                : "Please login to your wallet to continue"
              }
            </p>
          </div>

          {!showOtp ? (
            <div className="space-y-6">
              
              {/* Custom Tabs */}
              <div className="flex gap-6 border-b border-slate-200">
                <button
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${authTab === 'email' ? 'border-teal-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setAuthTab('email')}
                >
                  Email
                </button>
                <button
                  className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${authTab === 'wallet' ? 'border-teal-500 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  onClick={() => setAuthTab('wallet')}
                >
                  Wallet
                </button>
              </div>

              {authTab === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Email address
                    </label>
                    <input 
                      id="email" 
                      type="email" 
                      placeholder="abc@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 bg-white border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl px-4 text-slate-800 outline-none transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
                    disabled={isSubmitting || !email}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Continue with Email"
                    )}
                  </button>
                  <div className="text-center text-sm font-medium pt-2">
                    <span className="text-slate-600">Don&apos;t have an account? </span>
                    <Link href="#" className="text-teal-600 hover:underline">Register</Link>
                  </div>
                  <p className="pt-4 text-xs text-slate-400 font-medium">
                    By continuing, you agree to Nemesis&apos;s <Link href="#" className="underline hover:text-slate-600">Terms of Use</Link> and <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
                  </p>
                </form>
              ) : (
                <div className="pt-2 space-y-4">
                  <button 
                    onClick={handleWalletConnect}
                    disabled={isConnecting}
                    className="w-full h-12 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
                    ) : (
                      <>
                        <Wallet className="w-5 h-5 text-slate-500" />
                        Connect Wallet
                      </>
                    )}
                  </button>
                  <p className="pt-4 text-xs text-slate-400 font-medium">
                    By connecting, you agree to Nemesis&apos;s <Link href="#" className="underline hover:text-slate-600">Terms of Use</Link> and <Link href="#" className="underline hover:text-slate-600">Privacy Policy</Link>.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* OTP Form */
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white border border-slate-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 rounded-xl outline-none transition-all"
                  />
                ))}
              </div>
              
              {/* Mock OTP Display */}
              <div className="text-center text-xs text-slate-500 font-medium bg-slate-50 border border-slate-100 rounded-xl py-2 animate-in fade-in slide-in-from-top-2 duration-300">
                Mock OTP Code: <span className="font-mono font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">{mockOtpCode}</span>
              </div>
              
              <button 
                type="submit" 
                className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold shadow-sm shadow-teal-500/20 transition-all hover:shadow-md hover:shadow-teal-500/30 flex items-center justify-center disabled:opacity-50"
                disabled={isSubmitting || otp.join('').length !== 6}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Verify & Login"
                )}
              </button>

              <div className="flex items-center justify-center gap-1 text-sm">
                <span className="text-slate-500">Didn&apos;t receive the code?</span>
                <button 
                  type="button" 
                  onClick={() => { setShowOtp(false); setOtp(["", "", "", "", "", ""]); }}
                  className="text-teal-600 hover:text-teal-700 font-semibold transition-colors"
                >
                  Try again
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Bottom links */}
        <div className="text-xs font-medium space-y-4">
          <div className="flex flex-col gap-2 text-slate-500">
            <Link href="#" className="hover:text-slate-800 transition flex items-center gap-1">Learn about DePINFI Pools &rarr;</Link>
            <Link href="#" className="hover:text-slate-800 transition flex items-center gap-1">Visit Blogs &rarr;</Link>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="#" className="hover:text-teal-500 transition"><Twitter className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-teal-500 transition"><Send className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-teal-500 transition"><Linkedin className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-teal-500 transition"><Youtube className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-teal-500 transition"><Instagram className="w-4 h-4" /></Link>
            <Link href="#" className="hover:text-teal-500 transition"><MessageSquare className="w-4 h-4" /></Link>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive 0G-Style Showcase */}
      <div className="hidden lg:flex flex-col flex-1 bg-slate-50 relative p-8">
        
        {/* Subtle grid pattern background (like 0G) */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none" 
          style={{
            backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Top Banner (Exclusive) */}
        <div className="relative z-20 w-full bg-zinc-950 rounded-[2rem] p-6 md:p-8 flex items-center justify-between shadow-xl mb-6">
          <div className="space-y-1">
            <h3 className="text-xl md:text-2xl font-bold text-white">Exclusive</h3>
            <p className="text-zinc-400 text-sm">Join the Waitlist for Priority Access to New Investment Pools</p>
          </div>
          <Link href="/pools" className="px-6 py-2.5 bg-white text-zinc-950 rounded-full text-sm font-bold hover:bg-zinc-100 transition whitespace-nowrap">
            Join Waitlist &rarr;
          </Link>
        </div>

        {/* Main Showcase Layout */}
        <div className="relative z-10 flex-1 w-full flex flex-row items-stretch gap-6">
          


          {/* Right Side: Pure Interactive EV Ecosystem Component */}
          <div className="flex-1 h-full min-h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
             <InteractiveEVEcosystem />
          </div>

        </div>

      </div>
      {/* Wallet Connection Modal */}
      <WalletConnectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
        solanaConnectTrigger={async () => {
          await connect();
          const detected = (window as any).solana || (window as any).backpack?.solana;
          const addr = detected?.publicKey?.toString();
          return addr || null;
        }}
      />
    </div>
  );
}

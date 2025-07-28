import Link from "next/link";

export default function SSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12" style={{ background: 'var(--color-background)' }}>
      <div
        className="w-full max-w-2xl rounded-xl p-10"
        style={{
          background: 'var(--color-textwhite)',
          color: 'var(--color-textblack)',
          boxShadow: '0 8px 32px 0 rgba(2, 151, 121, 0.15)'
        }}
      >



        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold mb-2" style={{ color: 'var(--blue-shade-dark)' }}>Get Started</h2>
          <p className="text-base font-medium" style={{ color: 'var(--color-textgreydark)' }}>Select your role to continue</p>
        </div>

        {/*Role options */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Service Owner */}
          <Link href="/signup/registration" passHref legacyBehavior>
            <div
              className="w-full max-w-md rounded-2xl p-6 cursor-pointer transition-all  flex flex-col items-start gap-2 hover:scale-[1.025] hover:shadow-lg"
              style={{
                background: 'var(--color-background)',
                color: 'var(--color-textblack)',
                // border: '1.5px solid var(--blue-shade-light)',
                boxShadow: '0 2px 8px 0.5 rgba(0,153,204,0.05)',
                transition: 'all 0.2s cubic-bezier(.4,2,.6,1)' 
              }}
            >
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-textgraydark)' }}>Service Owner</h3>
              <p className="text-base" style={{ color: 'var(--color-textgreydark)' }}>
                If you have your own school van service with one or more school vans
              </p>
            </div>
          </Link>

          {/* Parent */}
          <Link href="/signup" passHref legacyBehavior>
            <div
              className="w-full max-w-md rounded-2xl p-6 cursor-pointer transition-all  flex flex-col items-start gap-2 hover:scale-[1.025] hover:shadow-lg"
              style={{
                background: 'var(--color-background)',
                color: 'var(--color-textblack)',
                // border: '1.5px solid var(--blue-shade-light)',
                boxShadow: '0 2px 8px 0.5 rgba(0,153,204,0.05)',
                transition: 'all 0.2s cubic-bezier(.4,2,.6,1)'
              }}
            >
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-textgraydark)' }}>Parent</h3>
              <p className="text-base" style={{ color: 'var(--color-textgreydark)' }}>
                If you want to find a school van for your child
              </p>
            </div>
          </Link>

          {/* Driver */}
          <Link href="/signup" passHref legacyBehavior>
            <div
              className="w-full max-w-md rounded-2xl p-6 cursor-pointer transition-all  flex flex-col items-start gap-2 hover:scale-[1.025] hover:shadow-lg"
              style={{
                background: 'var(--color-background)',
                color: 'var(--color-textblack)',
                // border: '1.5px solid var(--blue-shade-light)',
                boxShadow: '0 2px 8px 0.5 rgba(0,153,204,0.05)',
                transition: 'all 0.2s cubic-bezier(.4,2,.6,1)'
              }}
            >
              <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-textgraydark)' }}>Driver</h3>
              <p className="text-base" style={{ color: 'var(--color-textgreydark)' }}>
                If you are looking for or already working for a school van as a driver
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// export default SignupForm;
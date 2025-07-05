import Link from "next/link";

export default function SSignup() {
  return (
    <div className=" bg-cover bg-center bg-no-repeat relative justify-center justify-items-center pb-13" 
          style={{backgroundImage: 'url("../illustrations/signupBackground.png")'}}
    >
      
      <div className="flex items-center justify-center p-20 pb-0 w-full">
        <div className="bg-white w-8/10 px-29 pb-10 shadow-lg border-1 border-amber-50">
          
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="../logo/Logo_light.svg" 
              alt="SchoolWay Logo" 
              className="mx-auto h-auto w-3xs"
            />
          </div>
          
          <div className="mb-6">
            <p className="text-gray-700 text-lg font-medium">Are you a,</p>
          </div>
          
          {/*Role options */}
          <div className="w-full justify-items-center space-y-4">
            {/* Service Owner */}
            <Link href="/signup/registration" passHref legacyBehavior>
              <div className=" border hover:border-primary border-gray-shade rounded-lg p-4 cursor-pointer hover:bg-primary-shade transition-colors w-1/2 ">
                <h3 className="font-semibold text-gray-800 mb-2">Service Owner</h3>
                <p className="text-sm text-gray-600">
                  If you have your own school van service with one or more school vans
                </p>
              </div>
            </Link>

            {/* Parent */}
            <Link href="/signup" passHref legacyBehavior>
              <div className="border hover:border-primary border-gray-shade rounded-lg p-4 cursor-pointer hover:bg-primary-shade transition-colors w-1/2">
                <h3 className="font-semibold text-gray-800 mb-2">Parent</h3>
                <p className="text-sm text-gray-600">
                  If you want to find a school van for your child
                </p>
              </div>
            </Link>

            {/* Driver */}
            <Link href="/signup" passHref legacyBehavior>
              <div className=" border hover:border-primary border-gray-shade rounded-lg p-4 cursor-pointer hover:bg-primary-shade transition-colors w-1/2">
                <h3 className="font-semibold text-gray-800 mb-2">Driver</h3>
                <p className="text-sm text-gray-600">
                  If you are looking for or already working for a school van as a driver
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default SignupForm;
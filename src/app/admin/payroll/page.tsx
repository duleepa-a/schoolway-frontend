import TopBar from '@/app/dashboardComponents/TopBar'
import PayrollPageContent from './PayrollPageContent'

const PayrollPage = () => {

  return (
      <div>
        <section className="p-5 md:p-10 min-h-screen w-full">
          {/*Top bar with profile icon and the heading*/}
          <TopBar heading="Payroll" />
          <PayrollPageContent/>
        </section>
      </div>
  )
}

export default PayrollPage
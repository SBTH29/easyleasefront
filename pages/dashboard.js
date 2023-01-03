import Head from 'next/head';
import Dashboard from '../components/Dashboard';
const { redirect } = require("../components/isLogged")

function DashboardPage() {

  redirect("login");
  
  return (
    <>
      <Head>
        <title>Dashboard / EasyLease</title>
      </Head>
      <Dashboard />
    </>
  );
}

export default DashboardPage;
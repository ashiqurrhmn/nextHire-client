import PostJobForm from './PostJobForm';
import { getCompanyByUser, getLoggedInRecruiterCompany } from '@/lib/api/companies';
import Link from 'next/link';

const NewJobPage = async () => {

    const company = await getLoggedInRecruiterCompany();

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-950/40 text-zinc-400">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-white">No Company Registered</h2>
                <p className="text-sm text-zinc-500 max-w-sm">
                    You need to register your organization first before you can post a new job opening.
                </p>
                <Link href="/dashboard/recruiter/company">
                    <button className="h-11 rounded-xl bg-white text-black hover:bg-zinc-200 px-5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2 border-0">
                        Register a Company
                    </button>
                </Link>
            </div>
        );
    }

    // Block job posting if company is not approved
    if (company.status !== 'approved') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-900/50 bg-amber-950/20 text-amber-500">
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Company Pending Approval</h2>
                    <p className="text-sm text-zinc-400 max-w-md mt-2 leading-relaxed">
                        Your company <span className="font-semibold text-amber-400">&quot;{company.name}&quot;</span> is currently 
                        <span className="inline-flex items-center ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-900/40 bg-amber-950/20 text-amber-500">
                            {company.status || 'pending'}
                        </span>. 
                        An admin must approve your company before you can post job openings.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <Link href="/dashboard/recruiter/company">
                        <button className="h-11 rounded-xl bg-white text-black hover:bg-zinc-200 px-5 text-sm font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer border-0">
                            View My Companies
                        </button>
                    </Link>
                    <Link href="/dashboard/recruiter/jobs">
                        <button className="h-11 rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700 px-5 text-sm font-semibold transition-all cursor-pointer">
                            Back to Jobs
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PostJobForm company = {company}/>
        </div>
    );
};

export default NewJobPage;
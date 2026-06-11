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

    return (
        <div>
            <PostJobForm company = {company}/>
        </div>
    );
};

export default NewJobPage;
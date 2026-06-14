import { getJobById } from '@/lib/api/jobs';
import JobDetailsClient from './JobDetailsClient';
import { getUserSession } from '@/lib/core/session';
import { checkApplication, getMyAppliedJobIds } from '@/lib/actions/applications';

const page = async ({ params }) => {
    const { id } = await params;
    const job = await getJobById(id);
    const session = await getUserSession();
    
    let hasApplied = false;
    let totalApplicationsCount = 0;
    if (session?.id) {
        const result = await checkApplication(id, session.id);
        hasApplied = result?.hasApplied || false;
        
        const myApps = await getMyAppliedJobIds(session.id);
        totalApplicationsCount = myApps?.monthlyCount || 0;
    }
    
    return (
        <JobDetailsClient job={job} initialHasApplied={hasApplied} totalApplicationsCount={totalApplicationsCount} />
    )
}

export default page
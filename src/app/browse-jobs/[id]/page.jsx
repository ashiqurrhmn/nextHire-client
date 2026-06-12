import { getJobById } from '@/lib/api/jobs';
import JobDetailsClient from './JobDetailsClient';

const page = async ({ params }) => {
    const { id } = await params;
    const job = await getJobById(id);
    
    return (
        <JobDetailsClient job={job} />
    )
}

export default page
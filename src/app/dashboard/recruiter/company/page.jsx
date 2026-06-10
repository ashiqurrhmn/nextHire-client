import React from 'react';
import MyCompaniesPage from './MyCompaniesPage.jsx';
import { getUserSession } from '@/lib/core/session.js';
import { getCompanyByUser } from '@/lib/api/companies.js';

const CompanyPage = async () => {

    const user = await getUserSession();
    const company = await getCompanyByUser(user?.id);

    return (
        <div>
            <MyCompaniesPage recruiter = {user} recruiterCompany={company}/>
        </div>
    );
};

export default CompanyPage;
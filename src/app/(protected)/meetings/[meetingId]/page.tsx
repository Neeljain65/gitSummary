import React from "react";
import IssuesList from "./issues-list";

type Props = {
    params: Promise<{meetingId: string}>
}

const MeetingDetailsPage = async ({ params }: Props) => {
    const {meetingId} = await params;
    return( 
        <>
            <h1>Meeting Details</h1>
            <IssuesList meetingId={meetingId} />
        </>
    );
};

export default MeetingDetailsPage;
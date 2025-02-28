"use client"
import GeneralKeyWordsEditor from "@/src/components/GeneralKeyWordsEditor"
import GeneralServicesEditor from "@/src/components/GeneralServicesEditor"
import GeneralDomainsEditor from "@/src/components/GeneralDomainsEditor"
import TrackedCountriesEditor from "@/src/components/TrackedCountriesEditor"
import EditProfileForm from "@/src/components/EditCompanyForm"
import { Container } from "@mui/material"

const EditProfilePage = () => {
    return (
        <Container>
            <EditProfileForm />
            <TrackedCountriesEditor />
            <GeneralKeyWordsEditor />
            <GeneralServicesEditor />
            <GeneralDomainsEditor />
        </Container>
    )
}

export default EditProfilePage

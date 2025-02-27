"use client"

import { Box, Button, styled, Paper, Typography } from "@mui/material"
import { useState } from "react"
import QuizStepper from "@/src/features/QuizPages/components/QuizStepper"
import CompanyForm from "@/src/features/QuizPages/components/CompanyForm"
import SurveyStart, { SurveyType } from "./components/SurveyStart"
import { Company, GeneralService, TrackedCountry } from "@/src/utils/types" // предполагается, что тип Company экспортируется отсюда
import QuizGeneralKeyWordsEditor from "./components/QuizGeneralKeyWordsEditor"
import QuizGeneralServicesEditor from "./components/QuizGeneralServicesEditor"
import QuizTrackedCountriesEditor from "./components/QuizTrackedCountriesEditor"

interface QuizData {
    currentStep: number
    company: Company
}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
        backgroundColor: "#1A2027",
    }),
}))

const QuizPages: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizData>({
        currentStep: 0,
        company: {
            uuid: "",
            name: "",
            country: { country: "", country_name: "" },
            surveyType: "",
            address: {
                street: "",
                houseNumber: "",
                postalCode: "",
                city: "",
            },
            contact: {
                phone: "",
                email: "",
            },
            website: "",
            socialNetworks: {
                facebook: "",
                instagram: "",
                linkedin: "",
                twitter: "",
            },
            seo: {},
            generalKeywords: [],
            generalServices: [],
            generalDomains: [],
            trackedCountries: [],
        },
    })
    const [selectedSurveyType, setSelectedSurveyType] = useState<SurveyType | null>(null)

    const handleStepClick = (stepIndex: number) => {
        setQuizData((prev) => ({
            ...prev,
            currentStep: stepIndex,
        }))
    }

    const totalSteps = 5

    const updateCompanyData = (newData: Partial<Company>) => {
        setQuizData((prev) => ({
            ...prev,
            company: { ...prev.company, ...newData },
        }))
    }

    const goToNextStep = () => {
        setQuizData((prev) => ({
            ...prev,
            currentStep: prev.currentStep + 1,
        }))
    }

    const goToPrevStep = () => {
        setQuizData((prev) => ({
            ...prev,
            currentStep: prev.currentStep > 0 ? prev.currentStep - 1 : 0,
        }))
    }

    const renderStep = () => {
        switch (quizData.currentStep) {
            case 0:
                return (
                    <Box>
                        <SurveyStart
                            selectedSurveyType={selectedSurveyType}
                            onSelect={(type: SurveyType) => {
                                setSelectedSurveyType(type)
                                goToNextStep()
                            }}
                        />
                    </Box>
                )
            case 1:
                return (
                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h4" gutterBottom>
                            Creating and editing a profile
                        </Typography>
                        <CompanyForm
                            initialData={quizData.company}
                            onSave={(companyData: Company) => {
                                updateCompanyData(companyData)
                                goToNextStep()
                            }}
                        />
                    </Box>
                )
            case 2:
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            Please choose tracked countries (Max 3)
                        </Typography>
                        <Item>
                            <QuizTrackedCountriesEditor
                                trackedCountries={quizData.company.trackedCountries || []}
                                defaultCountry={quizData.company.country}
                                onTrackedCountriesChange={(newCountries: TrackedCountry[]) => updateCompanyData({ trackedCountries: newCountries })}
                            />
                        </Item>
                    </Box>
                )
            case 3:
                return (
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h4" gutterBottom>
                            What kind of companies should we look for with offers?
                        </Typography>
                        <Item>
                            <QuizGeneralKeyWordsEditor
                                generalKeywords={quizData.company.generalKeywords || []}
                                onKeywordsChange={(newKeywords: string[]) => updateCompanyData({ generalKeywords: newKeywords })}
                            />
                        </Item>
                    </Box>
                )
            case 4:
                return (
                    <Box>
                        <Typography variant="h4" gutterBottom>
                            What kind of companies should we look for with offers?
                        </Typography>
                        <Item>
                            <QuizGeneralServicesEditor
                                generalServices={quizData.company.generalServices || []}
                                onServicesChange={(newServices: GeneralService[]) => updateCompanyData({ generalServices: newServices })}
                            />
                        </Item>
                    </Box>
                )

            default:
                return (
                    <Box>
                        <h2>The survey is closed!</h2>
                        <pre>{JSON.stringify(quizData.company, null, 2)}</pre>
                    </Box>
                )
        }
    }

    return (
        <Box>
            <Box
                sx={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    p: 2,
                    pt: 3,
                }}
            >
                <QuizStepper
                    activeStep={quizData.currentStep}
                    steps={["Search target", "Company data", "Search terms", "Keys", "Request for Proposals"]}
                    onStepClick={handleStepClick}
                />
            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 68px - 130px)",
                    overflowY: "auto",
                    pt: 3,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        flex: "1 1 100%",
                        maxWidth: 1200,
                        margin: "0 auto",
                        p: 2,
                        pt: 3,
                    }}
                >
                    {renderStep()}
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: 2,
                        p: 2,
                        maxWidth: 1200,
                        margin: "0 auto",
                    }}
                >
                    <Button variant="contained" onClick={goToPrevStep} disabled={quizData.currentStep === 0}>
                        Prev
                    </Button>
                    <Button variant="contained" onClick={goToNextStep} disabled={quizData.currentStep >= totalSteps}>
                        Next
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default QuizPages

"use client"

import { Box, Button } from "@mui/material"
import { useState } from "react"
import QuizStepper from "@/src/features/QuizPages/components/QuizStepper"
import CompanyForm from "@/src/features/QuizPages/components/CompanyForm"
import SurveyStart, { SurveyType } from "./components/SurveyStart"
import { Company } from "@/src/utils/types" // предполагается, что тип Company экспортируется отсюда

interface QuizData {
    currentStep: number
    company: Company
}

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

    const handleStepClick = (stepIndex: number) => {
        setQuizData((prev) => ({
            ...prev,
            currentStep: stepIndex,
        }))
    }

    const totalSteps = 4

    // Функция для обновления данных компании в состоянии
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
                    <SurveyStart
                        onSelect={(surveyType: SurveyType) => {
                            updateCompanyData({ surveyType })
                            goToNextStep()
                        }}
                    />
                )
            case 1:
                return (
                    <CompanyForm
                        initialData={quizData.company}
                        onSave={(companyData: Company) => {
                            updateCompanyData(companyData)
                            goToNextStep()
                        }}
                    />
                )
            case 2:
                return (
                    <Box>
                        <h2>Step 3: Additional Data</h2>
                        {/* Здесь можно добавить сбор дополнительных данных */}
                    </Box>
                )
            case 3:
                return (
                    <Box>
                        <h2>Step 4: Final Details</h2>
                        {/* Здесь можно добавить финальные настройки */}
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
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 68px)",
                    overflowY: "auto",
                    pt: 3,
                }}
            >
                <QuizStepper
                    activeStep={quizData.currentStep}
                    steps={["Search target", "Company data", "Search terms", "Request for Proposals"]}
                    onStepClick={handleStepClick}
                />
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

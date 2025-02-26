"use client"

import { Box, Button } from "@mui/material"
import { useState } from "react"
import QuizStepper from "@/src/features/QuizPages/components/QuizStepper"
import CompanyForm from "@/src/features/QuizPages/components/CompanyForm"

import SurveyStart, { SurveyType } from "./components/SurveyStart"

interface QuizData {
    currentStep: number
    answers: {
        [key: string]: string
    }
}

const QuizPages: React.FC = () => {
    const [quizData, setQuizData] = useState<QuizData>({
        currentStep: 0,
        answers: {},
    })

    const totalSteps = 4

    const handleAnswerChange = (step: string, answer: string) => {
        setQuizData((prev) => ({
            ...prev,
            answers: { ...prev.answers, [step]: answer },
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
                            handleAnswerChange("surveyType", surveyType)
                            goToNextStep()
                        }}
                    />
                )
            case 1:
                return <CompanyForm />
            case 2:
                return (
                    <Box>
                        <h2>Step 3: Additional Data</h2>
                    </Box>
                )
            case 3:
                return (
                    <Box>
                        <h2>Step 4: Final Details</h2>
                    </Box>
                )
            default:
                return (
                    <Box>
                        <h2>The survey is closed!</h2>
                        <pre>{JSON.stringify(quizData.answers, null, 2)}</pre>
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
                <QuizStepper activeStep={quizData.currentStep} steps={["Search target", "Company data", "Search terms", "Request for Proposals"]} />
                <Box sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", flex: "1 1 100%", maxWidth: 1200, margin: "0 auto", p: 2, pt: 3 }}>
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

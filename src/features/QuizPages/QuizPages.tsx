"use client"

import { Box, Button, styled, Paper, Typography } from "@mui/material"
import { useCallback, useEffect, useReducer, useState } from "react"
import QuizStepper from "@/src/features/QuizPages/components/QuizStepper"
import CompanyForm from "@/src/features/QuizPages/components/CompanyForm"
import SurveyStart, { SurveyType } from "./components/SurveyStart"
import { Company, GeneralService, TrackedCountry } from "@/src/utils/types"
import QuizGeneralKeyWordsEditor from "./components/QuizGeneralKeyWordsEditor"
import QuizGeneralServicesEditor from "./components/QuizGeneralServicesEditor"
import QuizTrackedCountriesEditor from "./components/QuizTrackedCountriesEditor"
import { addCompanyToDB } from "@/src/services/firebaseService"
import { useRouter } from "next/navigation"
import { COMPANIES_ROUTE } from "@/src/utils/consts"

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

type QuizState = {
    currentStep: number
    company: Company
}

type QuizAction = { type: "SET_STEP"; payload: number } | { type: "NEXT_STEP" } | { type: "PREV_STEP" } | { type: "UPDATE_COMPANY"; payload: Partial<Company> }

const initialCompany: Company = {
    uuid: "",
    name: "",
    country: { country: "de", country_name: "Germany" },
    surveyType: "",
    address: { street: "", houseNumber: "", postalCode: "", city: "" },
    contact: { phone: "", email: "" },
    website: "",
    socialNetworks: { facebook: "", instagram: "", linkedin: "", twitter: "" },
    seo: {},
    generalKeywords: [],
    generalServices: [],
    generalDomains: [],
    trackedCountries: [],
}

const initialState: QuizState = {
    currentStep: 0,
    company: initialCompany,
}

const totalSteps = 5

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
    switch (action.type) {
        case "SET_STEP":
            return { ...state, currentStep: action.payload }
        case "NEXT_STEP":
            return { ...state, currentStep: state.currentStep + 1 }
        case "PREV_STEP":
            return { ...state, currentStep: Math.max(state.currentStep - 1, 0) }
        case "UPDATE_COMPANY":
            return { ...state, company: { ...state.company, ...action.payload } }
        default:
            return state
    }
}

const QuizPages: React.FC = () => {
    const router = useRouter()
    const [state, dispatch] = useReducer(quizReducer, initialState)
    const { currentStep, company } = state
    const [selectedSurveyType, setSelectedSurveyType] = useState<SurveyType | null>(null)

    console.log("company:", company)

    const handleStepClick = (stepIndex: number) => {
        dispatch({ type: "SET_STEP", payload: stepIndex })
    }

    const createCompany = useCallback(
        async (data: Company) => {
            const newCompany: Omit<Company, "uuid"> = {
                name: data.name || "Default Company Name",
                country: data.country || { country: "de", country_name: "Germany" },
                surveyType: data.surveyType || "",
                address: data.address || { street: "", houseNumber: "", postalCode: "", city: "" },
                contact: data.contact || { email: "", phone: "" },
                website: data.website || "",
                socialNetworks: data.socialNetworks || { facebook: "", instagram: "", linkedin: "", twitter: "" },
                seo: data.seo || {},
                generalKeywords: data.generalKeywords || [],
                generalServices: data.generalServices || [],
                generalDomains: data.generalDomains || [],
                trackedCountries: data.trackedCountries || [],
            }

            try {
                await addCompanyToDB(newCompany)
                router.push(COMPANIES_ROUTE)
            } catch (error) {
                console.error("Error creating company:", error)
            }
        },
        [router]
    )

    useEffect(() => {
        if (currentStep === totalSteps) {
            createCompany(company)
        }
    }, [currentStep, company, createCompany])

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Box>
                        <SurveyStart
                            selectedSurveyType={selectedSurveyType}
                            onSelect={(type: SurveyType) => {
                                setSelectedSurveyType(type)
                                dispatch({ type: "UPDATE_COMPANY", payload: { surveyType: type } })
                                dispatch({ type: "NEXT_STEP" })
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
                            initialData={company}
                            onSave={(companyData: Company) => {
                                dispatch({ type: "UPDATE_COMPANY", payload: companyData })
                                dispatch({ type: "NEXT_STEP" })
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
                                trackedCountries={company.trackedCountries || []}
                                defaultCountry={company.country}
                                onTrackedCountriesChange={(newCountries: TrackedCountry[]) => dispatch({ type: "UPDATE_COMPANY", payload: { trackedCountries: newCountries } })}
                            />
                            <Box sx={{ pt: 2 }}>
                                <Button variant="contained" onClick={() => dispatch({ type: "NEXT_STEP" })}>
                                    Next
                                </Button>
                            </Box>
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
                                generalKeywords={company.generalKeywords || []}
                                onKeywordsChange={(newKeywords: string[]) => dispatch({ type: "UPDATE_COMPANY", payload: { generalKeywords: newKeywords } })}
                            />
                            <Box sx={{ pt: 2 }}>
                                <Button variant="contained" onClick={() => dispatch({ type: "NEXT_STEP" })}>
                                    Next
                                </Button>
                            </Box>
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
                                generalServices={company.generalServices || []}
                                onServicesChange={(newServices: GeneralService[]) => dispatch({ type: "UPDATE_COMPANY", payload: { generalServices: newServices } })}
                            />
                            <Box sx={{ pt: 2 }}>
                                <Button variant="contained" onClick={() => dispatch({ type: "NEXT_STEP" })}>
                                    Next
                                </Button>
                            </Box>
                        </Item>
                    </Box>
                )
            default:
                return null
        }
    }

    return (
        <Box>
            <Box sx={{ maxWidth: 1200, margin: "0 auto", p: 2, pt: 3 }}>
                <QuizStepper activeStep={currentStep} steps={["Search target", "Company data", "Search terms", "Keys", "Request for Proposals"]} onStepClick={handleStepClick} />
            </Box>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100vh - 68px - 130px)",
                    overflowY: "auto",
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
            </Box>
        </Box>
    )
}

export default QuizPages

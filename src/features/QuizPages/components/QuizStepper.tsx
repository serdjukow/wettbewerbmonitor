import * as React from "react"
import { styled } from "@mui/material/styles"
import Stack from "@mui/material/Stack"
import Stepper from "@mui/material/Stepper"
import Step from "@mui/material/Step"
import StepLabel from "@mui/material/StepLabel"
import SettingsIcon from "@mui/icons-material/Settings"
import StepConnector, { stepConnectorClasses } from "@mui/material/StepConnector"
import { StepIconProps } from "@mui/material/StepIcon"
import TravelExploreIcon from "@mui/icons-material/TravelExplore"
import ExploreIcon from "@mui/icons-material/Explore"
import ApartmentIcon from "@mui/icons-material/Apartment"
import KeyIcon from "@mui/icons-material/Key"

const ColorlibStepIconRoot = styled("div")<{
    ownerState: { completed?: boolean; active?: boolean }
}>(({ ownerState }) => ({
    backgroundColor: "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 50,
    height: 50,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    ...(ownerState.active && {
        backgroundImage: "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
        backgroundImage: "linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    }),
}))

function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props

    const icons: { [index: string]: React.ReactElement } = {
        1: <ExploreIcon />,
        2: <ApartmentIcon />,
        3: <TravelExploreIcon />,
        4: <KeyIcon />,
        5: <SettingsIcon />,
    }

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    )
}

const ColorlibConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: "linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage: "linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor: "#eaeaf0",
        borderRadius: 1,
    },
}))

interface QuizStepperProps {
    activeStep: number
    steps?: string[]
    onStepClick?: (stepIndex: number) => void
}

const QuizStepper: React.FC<QuizStepperProps> = ({ activeStep, steps = ["Step 1", "Step 2", "Step 3"], onStepClick }) => {
    return (
        <Stack sx={{ width: "100%" }} spacing={4}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
                {steps.map((label, index) => {
                    const isClickable = index <= activeStep
                    return (
                        <Step
                            key={label}
                            onClick={() => {
                                if (isClickable && onStepClick) {
                                    onStepClick(index)
                                }
                            }}
                            sx={{ cursor: isClickable ? "pointer" : "default" }}
                        >
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                    )
                })}
            </Stepper>
        </Stack>
    )
}

export default QuizStepper

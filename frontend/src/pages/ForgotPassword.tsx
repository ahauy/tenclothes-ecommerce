import { useState } from "react";
import { EmailStep } from "../components/ForgotPassword/EmailStep";
import { OtpStep } from "../components/ForgotPassword/OtpStep";
import { ResetStep } from "../components/ForgotPassword/ResetStep";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState<string>("");

  switch (step) {
    case 1:
      return <EmailStep email={email} setEmail={setEmail} setStep={setStep} />;
    case 2:
      return <OtpStep email={email} setOtp={setOtp} setStep={setStep} />;
    case 3:
      return <ResetStep email={email} otp={otp} />;
    default:
      return <EmailStep email={email} setEmail={setEmail} setStep={setStep} />;
  }
};

export default ForgotPassword;

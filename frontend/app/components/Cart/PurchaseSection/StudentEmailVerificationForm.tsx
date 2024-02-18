"use client";

import { fetchAPI } from "@/app/utils/fetch-api";
import { useRef, useState } from "react";

export default function StudentEmailVerificationForm({
  setStudentEmailValid,
}: {
  setStudentEmailValid: Function;
}) {
  const [isStudentEmailInvalid, setIsStudentEmailInvalid] = useState(false);
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const studentEmailRef = useRef<HTMLInputElement>(null);
  const verificationCodeRef = useRef<HTMLInputElement>(null);

  const sendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStudentEmailInvalid(false);
    const studentEmail = studentEmailRef.current?.value;

    if (studentEmail) {
      const response = await fetchAPI(
        "/order/send_verification_code",
        {},
        {
          method: "POST",
          body: JSON.stringify({
            studentEmail: studentEmail,
          }),
        }
      );

      if (response.status === 200) {
        setIsVerificationCodeSent(true);
        setTimeout(() => {
          setIsVerificationCodeSent(false);
        }, 7000);
      } else {
        setIsStudentEmailInvalid(true);
        setTimeout(() => {
          setIsStudentEmailInvalid(false);
        }, 7000);
      }
    }
  };

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    const studentEmail = studentEmailRef.current?.value;
    const verificationCode = verificationCodeRef.current?.value;

    if (verificationCode) {
      const response = await fetchAPI(
        "/order/verify_student_email",
        {},
        {
          method: "POST",
          body: JSON.stringify({
            studentEmail: studentEmail,
            code: verificationCode,
          }),
        }
      );

      if (response.status === 200) {
        setStudentEmailValid({ email: studentEmailRef.current?.value, isVerified: true });

        setIsEmailVerified(true);
        setTimeout(() => {
          setIsEmailVerified(false);
        }, 7000);
      }
    }
  };

  return (
    <div className="student-email-verification">
      <form>
        <div className="form-row">
          <input
            ref={studentEmailRef}
            type="email"
            name="email"
            id="email"
            placeholder="Student E-mail address*"
            required
          />
          <button type="submit" onClick={sendVerificationCode}>
            Send e-mail
          </button>
        </div>
        {isStudentEmailInvalid && (
          <p className="message validation-error">
            Student email appears to be invalid. Try again with a different email.
          </p>
        )}
        {isVerificationCodeSent && (
          <p className="message success">Verification code has been sent to your email address.</p>
        )}
      </form>
      <form>
        <div className="form-row">
          <input
            ref={verificationCodeRef}
            type="text"
            name="verification-code"
            id="verification-code"
            placeholder="Verification code*"
            required
          />
          <button type="submit" onClick={verifyEmail}>
            Submit
          </button>
        </div>
        {isEmailVerified && (
          <p className="message success">
            Your student email has been verified. You get 50% discount.
          </p>
        )}
      </form>
    </div>
  );
}

"use client";

import { fetchAPI } from "@/app/utils/fetch-api";
import { useRef, useState } from "react";

export default function StudentEmailVerificationForm({
  setEmailValid,
}: {
  setEmailValid: Function;
}) {
  const [isStudentEmailInvalid, setIsStudentEmailInvalid] = useState(false);
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

      if (response.status === 406) {
        setIsStudentEmailInvalid(true);

        setTimeout(() => {
          setIsStudentEmailInvalid(false);
        }, 5000);
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
        console.log("it works!!");
        // setIsStudentEmailInvalid(true);
      }
    }
  };

  return (
    <>
      <form>
        <div>
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
          <p>Student email appears to be invalid. Try again with a different email.</p>
        )}
      </form>
      <form>
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
      </form>
    </>
  );
}
